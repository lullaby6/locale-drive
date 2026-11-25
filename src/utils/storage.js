import path from 'path';
import fs from 'fs';

import { storagePath } from '../config.js';
import { HttpError } from './http-error.js';

export const storageRoot = path.resolve(storagePath);

const INVALID_NAME_CHARS = /[<>:"/\\|?*\u0000-\u001F]/;
const RESERVED_NAMES = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i;
const MAX_NAME_LENGTH = 255;

/**
 * Resolves a path relative to the storage root, making sure it never escapes it.
 * An empty path ("" or "/") resolves to the storage root itself.
 */
export function resolveSafePath(relativePath = '') {
    if (relativePath !== undefined && typeof relativePath !== 'string') {
        throw new HttpError(400, 'Invalid path', 'INVALID_PATH');
    }

    const target = path.resolve(storageRoot, `.${path.sep}${relativePath || ''}`);

    if (target !== storageRoot && !target.startsWith(storageRoot + path.sep)) {
        throw new HttpError(400, 'Invalid path', 'INVALID_PATH');
    }

    return target;
}

/** Converts an absolute path inside the storage into a "a/b/c" style relative path. */
export function toRelativePath(absolutePath) {
    return path.relative(storageRoot, absolutePath).split(path.sep).join('/');
}

/** Validates a single file or folder name (no separators, no reserved names). Returns the trimmed name. */
export function validateName(name) {
    if (typeof name !== 'string') throw new HttpError(400, 'Invalid name', 'NAME_EMPTY');

    const trimmed = name.trim();

    if (trimmed === '' || trimmed === '.' || trimmed === '..') {
        throw new HttpError(400, 'Name cannot be empty', 'NAME_EMPTY');
    }
    if (trimmed.length > MAX_NAME_LENGTH) {
        throw new HttpError(400, `Name cannot be longer than ${MAX_NAME_LENGTH} characters`, 'NAME_TOO_LONG', { max: MAX_NAME_LENGTH });
    }
    if (INVALID_NAME_CHARS.test(trimmed)) {
        throw new HttpError(400, 'Name cannot contain any of these characters: < > : " / \\ | ? *', 'NAME_INVALID_CHARS');
    }
    if (RESERVED_NAMES.test(trimmed)) {
        throw new HttpError(400, `"${trimmed}" is a reserved name`, 'NAME_RESERVED', { name: trimmed });
    }
    if (/[. ]$/.test(trimmed)) {
        throw new HttpError(400, 'Name cannot end with a dot or a space', 'NAME_TRAILING');
    }

    return trimmed;
}

export async function statPath(relativePath) {
    const safePath = resolveSafePath(relativePath);

    try {
        const stats = await fs.promises.stat(safePath);
        return { safePath, stats };
    } catch (error) {
        if (error.code === 'ENOENT') throw new HttpError(404, 'File or folder not found', 'NOT_FOUND');
        throw error;
    }
}

export async function statExistingFile(relativePath, action = 'access') {
    const result = await statPath(relativePath);

    if (result.stats.isDirectory()) {
        throw new HttpError(400, `Cannot ${action} a folder`, 'IS_A_FOLDER');
    }

    return result;
}

export async function statExistingDir(relativePath) {
    const result = await statPath(relativePath);

    if (!result.stats.isDirectory()) {
        throw new HttpError(400, 'Path is not a folder', 'NOT_A_FOLDER');
    }

    return result;
}

export async function pathExists(absolutePath) {
    try {
        await fs.promises.access(absolutePath);
        return true;
    } catch {
        return false;
    }
}

/**
 * Returns a free "name (n).ext" variant inside `dir` if `name` is already taken.
 * Folders keep their whole name as the base ("v1.2" -> "v1.2 (1)").
 */
export function getAvailableName(dir, name, { isDirectory = false } = {}) {
    const { name: parsedBase, ext: parsedExt } = path.parse(name);
    const base = isDirectory ? name : parsedBase;
    const ext = isDirectory ? '' : parsedExt;

    let candidate = name;
    let counter = 1;

    while (fs.existsSync(path.join(dir, candidate))) {
        candidate = `${base} (${counter})${ext}`;
        counter++;
    }

    return candidate;
}
