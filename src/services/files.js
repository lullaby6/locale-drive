import path from 'path';
import fs from 'fs';

import { storagePath } from '../config.js';
import { resolveSafePath, statExistingFile } from '../utils/storage.js';

function buildFileInfo(filename, stats) {
    const filePath = path.join(storagePath, filename);

    return {
        filename,
        filePath,
        realFilePath: path.resolve(filePath),
        size: stats.size,
        creationDate: stats.birthtime,
        modificationDate: stats.mtime,
    };
}

const SORTERS = {
    filename: (a, b) =>
        a.filename.localeCompare(b.filename, undefined, { numeric: true, sensitivity: 'base' }),
    size: (a, b) => a.size - b.size,
    creationDate: (a, b) => a.creationDate - b.creationDate,
    modificationDate: (a, b) => a.modificationDate - b.modificationDate,
};

export async function listFiles({ query = null, sort = 'modificationDate', order = 'desc' } = {}) {
    const dirents = await fs.promises.readdir(storagePath, { withFileTypes: true });
    const lowerQuery = query ? query.toLowerCase() : null;

    const files = (
        await Promise.all(
            dirents.map(async dirent => {
                if (dirent.isDirectory()) return null;

                const filename = dirent.name;
                if (lowerQuery && !filename.toLowerCase().includes(lowerQuery)) return null;

                const stats = await fs.promises.stat(path.join(storagePath, filename));
                return buildFileInfo(filename, stats);
            })
        )
    ).filter(Boolean);

    const comparator = SORTERS[sort] || SORTERS.modificationDate;
    files.sort((a, b) => (order === 'desc' ? -comparator(a, b) : comparator(a, b)));

    return {
        files,
        path: storagePath,
        realPath: path.resolve(storagePath),
    };
}

export async function readFile(filename) {
    const { safePath, stats } = await statExistingFile(filename, 'download');
    const content = await fs.promises.readFile(safePath);

    return {
        ...buildFileInfo(filename, stats),
        content: content.toString(),
    };
}

export async function deleteFile(filename) {
    const { safePath } = await statExistingFile(filename, 'delete');
    await fs.promises.unlink(safePath);
}

export async function renameFile(filename, newFilename) {
    const { safePath } = await statExistingFile(filename, 'rename');
    const targetPath = resolveSafePath(newFilename);
    await fs.promises.rename(safePath, targetPath);
}

export async function getDownloadStream(filename) {
    const { safePath, stats } = await statExistingFile(filename, 'download');
    return { stream: fs.createReadStream(safePath), filename, size: stats.size };
}
