import multer from 'multer';

import { HttpError } from '../utils/http-error.js';

export function errorHandler(err, req, res, next) {
    if (res.headersSent) return next(err);

    if (err instanceof HttpError) {
        return res.status(err.status).json({ message: err.message });
    }

    if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: 'Upload error', error: err.message });
    }

    res.status(500).json({ message: 'Internal server error', error: err.message });
}
