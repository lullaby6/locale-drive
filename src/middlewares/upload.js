import multer from 'multer';
import fs from 'fs';
import path from 'path';

import { maxUploadBytes } from '../config.js';
import { HttpError } from '../utils/http-error.js';
import { resolveSafePath, getAvailableName } from '../utils/storage.js';

const INVALID_NAME_CHARS = /[<>:"/\\|?*\u0000-\u001F]/g;

/**
 * Browsers send the filename as UTF-8 but busboy decodes it as latin1,
 * which turns "canción.mp3" into "canciÃ³n.mp3". Re-decode it and strip unsafe characters.
 */
function sanitizeOriginalName(originalName) {
    let name = Buffer.from(originalName, 'latin1').toString('utf8');
    if (name.includes('�')) name = originalName;

    name = path.basename(name.replace(/\\/g, '/'))
        .replace(INVALID_NAME_CHARS, '_')
        .replace(/[. ]+$/, '')
        .trim();

    return name || 'file';
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        try {
            const dir = resolveSafePath(req.query?.dir || '');
            const stats = fs.statSync(dir, { throwIfNoEntry: false });

            if (!stats || !stats.isDirectory()) {
                return cb(new HttpError(404, 'Destination folder not found', 'NOT_FOUND'));
            }

            cb(null, dir);
        } catch (error) {
            cb(error);
        }
    },
    filename: (req, file, cb) => {
        const dir = resolveSafePath(req.query?.dir || '');
        cb(null, getAvailableName(dir, sanitizeOriginalName(file.originalname)));
    },
});

export const upload = multer({
    storage,
    limits: maxUploadBytes > 0 ? { fileSize: maxUploadBytes } : undefined,
});
