import multer from 'multer';

import { maxUploadBytes } from '../config.js';
import { HttpError } from '../utils/http-error.js';
import { formatBytes } from '../utils/utils.js';

export function errorHandler(err, req, res, next) {
    if (res.headersSent) return next(err);

    if (err instanceof HttpError) {
        return res.status(err.status).json({ message: err.message, code: err.code, params: err.params });
    }

    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(413).json({
                message: `File is too large. The max upload size is ${formatBytes(maxUploadBytes)}`,
                code: 'FILE_TOO_LARGE',
                params: { max: maxUploadBytes },
            });
        }

        return res.status(400).json({ message: `Upload error: ${err.message}` });
    }

    if (err.type === 'entity.too.large') {
        return res.status(413).json({ message: 'Request is too large' });
    }

    res.status(500).json({ message: 'Internal server error', error: err.message });
}
