import path from 'path';
import fs from 'fs';

import { ZipArchive } from 'archiver';

import { HttpError } from '../utils/http-error.js';
import {
    storageRoot,
    toRelativePath,
    validateName,
    statPath,
    statExistingFile,
    statExistingDir,
    pathExists,
    getAvailableName,
} from '../utils/storage.js';
import { onChange } from './events.js';

const MAX_SEARCH_RESULTS = 500;

async function buildEntry(absolutePath, stats) {
    const isDirectory = stats.isDirectory();

    let items = null;
    if (isDirectory) {
        try {
            items = (await fs.promises.readdir(absolutePath)).length;
        } catch {
            items = 0;
        }
    }

    const relativePath = toRelativePath(absolutePath);
    const parent = path.posix.dirname(relativePath);

    return {
        name: path.basename(absolutePath),
        path: relativePath,
        parent: parent === '.' ? '' : parent,
        type: isDirectory ? 'folder' : 'file',
        size: isDirectory ? 0 : stats.size,
        items,
        creationDate: stats.birthtime,
        modificationDate: stats.mtime,
    };
}

async function safeBuildEntry(absolutePath) {
    try {
        return await buildEntry(absolutePath, await fs.promises.stat(absolutePath));
    } catch {
        // The entry may have been removed while listing, or be unreadable (broken link, permissions).
        return null;
    }
}

async function searchEntries(absoluteDir, lowerQuery) {
    const matches = [];
    const queue = [absoluteDir];

    while (queue.length > 0 && matches.length < MAX_SEARCH_RESULTS) {
        const current = queue.shift();

        let dirents;
        try {
            dirents = await fs.promises.readdir(current, { withFileTypes: true });
        } catch {
            continue;
        }

        for (const dirent of dirents) {
            const absolutePath = path.join(current, dirent.name);

            if (dirent.isDirectory()) queue.push(absolutePath);
            if (dirent.name.toLowerCase().includes(lowerQuery)) matches.push(absolutePath);
            if (matches.length >= MAX_SEARCH_RESULTS) break;
        }
    }

    return matches;
}

const SORTERS = {
    filename: (a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }),
    size: (a, b) => (a.type === 'folder' ? a.items - b.items : a.size - b.size),
    creationDate: (a, b) => a.creationDate - b.creationDate,
    modificationDate: (a, b) => a.modificationDate - b.modificationDate,
};

export async function listEntries({ dir = '', query = null, sort = 'modificationDate', order = 'desc' } = {}) {
    const { safePath } = await statExistingDir(dir);

    const lowerQuery = query ? query.toLowerCase() : null;

    const absolutePaths = lowerQuery
        ? await searchEntries(safePath, lowerQuery)
        : (await fs.promises.readdir(safePath)).map(name => path.join(safePath, name));

    const entries = (await Promise.all(absolutePaths.map(safeBuildEntry))).filter(Boolean);

    const comparator = SORTERS[sort] || SORTERS.modificationDate;
    const direction = order === 'asc' ? 1 : -1;

    entries.sort((a, b) => {
        if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
        return direction * comparator(a, b) || SORTERS.filename(a, b);
    });

    return {
        entries,
        dir: toRelativePath(safePath),
        realPath: safePath,
        rootPath: storageRoot,
        truncated: Boolean(lowerQuery) && entries.length >= MAX_SEARCH_RESULTS,
    };
}

export async function createFolder(dir, name) {
    const { safePath: parent } = await statExistingDir(dir);
    const folderName = getAvailableName(parent, validateName(name), { isDirectory: true });
    const target = path.join(parent, folderName);

    await fs.promises.mkdir(target);

    return { path: toRelativePath(target), name: folderName };
}

function isSameOrInside(child, parent) {
    return child === parent || child.startsWith(parent + path.sep);
}

async function moveAcrossDevices(source, target) {
    await fs.promises.cp(source, target, { recursive: true, errorOnExist: true, force: false });
    await fs.promises.rm(source, { recursive: true, force: true });
}

/** Moves files/folders into `destination`. Name clashes get a " (n)" suffix instead of overwriting. */
export async function moveEntries(relativePaths, destination) {
    if (!Array.isArray(relativePaths) || relativePaths.length === 0) {
        throw new HttpError(400, 'Nothing to move', 'NOTHING_SELECTED');
    }

    const { safePath: destinationPath } = await statExistingDir(destination || '');

    const sources = await Promise.all(relativePaths.map(async relativePath => {
        const { safePath, stats } = await statPath(relativePath);

        if (safePath === storageRoot) throw new HttpError(400, 'Cannot move the storage folder', 'ROOT_PROTECTED');
        if (stats.isDirectory() && isSameOrInside(destinationPath, safePath)) {
            throw new HttpError(400, `Cannot move "${path.basename(safePath)}" into itself`, 'MOVE_INTO_ITSELF', { name: path.basename(safePath) });
        }

        return { safePath, isDirectory: stats.isDirectory() };
    }));

    let moved = 0;

    for (const { safePath, isDirectory } of sources) {
        if (path.dirname(safePath) === destinationPath) continue;

        const name = getAvailableName(destinationPath, path.basename(safePath), { isDirectory });
        const target = path.join(destinationPath, name);

        try {
            await fs.promises.rename(safePath, target);
        } catch (error) {
            if (error.code !== 'EXDEV') throw error;
            await moveAcrossDevices(safePath, target);
        }

        moved++;
    }

    return moved;
}

/** Copies a file or folder next to itself as "name (copy).ext". */
export async function duplicateEntry(relativePath) {
    const { safePath, stats } = await statPath(relativePath);

    if (safePath === storageRoot) throw new HttpError(400, 'Cannot duplicate the storage folder', 'ROOT_PROTECTED');

    const isDirectory = stats.isDirectory();
    const parent = path.dirname(safePath);
    const { name: base, ext } = path.parse(path.basename(safePath));

    const copyName = isDirectory ? `${path.basename(safePath)} (copy)` : `${base} (copy)${ext}`;
    const name = getAvailableName(parent, copyName, { isDirectory });
    const target = path.join(parent, name);

    await fs.promises.cp(safePath, target, { recursive: true, errorOnExist: true, force: false, preserveTimestamps: false });

    return { path: toRelativePath(target), name };
}

export async function deleteEntries(relativePaths) {
    if (!Array.isArray(relativePaths) || relativePaths.length === 0) {
        throw new HttpError(400, 'Nothing to delete', 'NOTHING_SELECTED');
    }

    const targets = await Promise.all(relativePaths.map(async relativePath => {
        const { safePath } = await statPath(relativePath);
        if (safePath === storageRoot) throw new HttpError(400, 'Cannot delete the storage folder', 'ROOT_PROTECTED');
        return safePath;
    }));

    for (const target of targets) {
        await fs.promises.rm(target, { recursive: true, force: true });
    }

    return targets.length;
}

export async function renameEntry(relativePath, newName) {
    const { safePath } = await statPath(relativePath);

    if (safePath === storageRoot) throw new HttpError(400, 'Cannot rename the storage folder', 'ROOT_PROTECTED');

    const name = validateName(newName);
    const target = path.join(path.dirname(safePath), name);

    if (target === safePath) return toRelativePath(target);

    // Allow case-only renames ("photo.JPG" -> "photo.jpg") on case-insensitive file systems.
    const isCaseOnlyRename = target.toLowerCase() === safePath.toLowerCase();

    if (!isCaseOnlyRename && (await pathExists(target))) {
        throw new HttpError(409, `"${name}" already exists in this folder`, 'ALREADY_EXISTS', { name });
    }

    await fs.promises.rename(safePath, target);

    return toRelativePath(target);
}

export async function getDownloadFile(relativePath) {
    const { safePath } = await statExistingFile(relativePath, 'download');
    return { safePath, filename: path.basename(safePath) };
}

function timestamp() {
    const now = new Date();
    const pad = value => String(value).padStart(2, '0');

    return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
}

/** Validates the paths and returns everything needed to stream them as a single .zip file. */
export async function prepareZip(relativePaths) {
    if (!Array.isArray(relativePaths) || relativePaths.length === 0) {
        throw new HttpError(400, 'Nothing to download', 'NOTHING_SELECTED');
    }

    const items = await Promise.all(relativePaths.map(async relativePath => {
        const { safePath, stats } = await statPath(relativePath);
        return { safePath, isDirectory: stats.isDirectory(), name: path.basename(safePath) || 'storage' };
    }));

    const filename = items.length === 1
        ? `${items[0].name}.zip`
        : `locale-drive-${timestamp()}.zip`;

    const createArchive = () => {
        const archive = new ZipArchive({ zlib: { level: 5 } });
        const usedNames = new Set();

        for (const item of items) {
            let name = item.name;
            for (let counter = 1; usedNames.has(name.toLowerCase()); counter++) {
                name = `${item.name} (${counter})`;
            }
            usedNames.add(name.toLowerCase());

            if (item.isDirectory) archive.directory(item.safePath, name);
            else archive.file(item.safePath, { name });
        }

        archive.finalize();

        return archive;
    };

    return { filename, createArchive };
}

let statsCache = null;

onChange(() => {
    statsCache = null;
});

async function walkStorage() {
    let files = 0;
    let folders = 0;
    let bytes = 0;

    const queue = [storageRoot];

    while (queue.length > 0) {
        const current = queue.shift();

        let dirents;
        try {
            dirents = await fs.promises.readdir(current, { withFileTypes: true });
        } catch {
            continue;
        }

        await Promise.all(dirents.map(async dirent => {
            const absolutePath = path.join(current, dirent.name);

            if (dirent.isDirectory()) {
                folders++;
                queue.push(absolutePath);
                return;
            }

            try {
                const stats = await fs.promises.stat(absolutePath);
                files++;
                bytes += stats.size;
            } catch {
                // ignore unreadable entries
            }
        }));
    }

    return { files, folders, bytes };
}

export async function getStats() {
    if (!statsCache) statsCache = walkStorage();

    let disk = null;
    try {
        const info = await fs.promises.statfs(storageRoot);
        disk = {
            total: info.blocks * info.bsize,
            free: info.bavail * info.bsize,
        };
    } catch {
        // statfs is not available everywhere; disk info is optional.
    }

    try {
        return { ...(await statsCache), disk };
    } catch (error) {
        statsCache = null;
        throw error;
    }
}
