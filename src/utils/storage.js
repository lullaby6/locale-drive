import path from 'path';
import fs from 'fs';

import { storagePath } from '../config.js';
import { HttpError } from './http-error.js';

const storageRoot = path.resolve(storagePath);

export function resolveSafePath(filename) {
    if (typeof filename !== 'string' || filename.trim() === '') {
        throw new HttpError(400, 'Invalid filename');
    }

    const target = path.resolve(storageRoot, filename);

    if (target !== storageRoot && !target.startsWith(storageRoot + path.sep)) {
        throw new HttpError(400, 'Invalid filename');
    }

    return target;
}

export async function statExistingFile(filename, action = 'access') {
    const safePath = resolveSafePath(filename);

    let stats;
    try {
        stats = await fs.promises.stat(safePath);
    } catch (error) {
        if (error.code === 'ENOENT') throw new HttpError(404, 'File not found');
        throw error;
    }

    if (stats.isDirectory()) {
        throw new HttpError(400, `Cannot ${action} directory`);
    }

    return { safePath, stats };
}
