import multer from 'multer';
import path from 'path';
import fs from 'fs';

import { storagePath } from '../config.js';

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, storagePath),
    filename: (req, file, cb) => {
        const { name, ext } = path.parse(file.originalname);

        let candidate = file.originalname;
        let counter = 1;

        while (fs.existsSync(path.join(storagePath, candidate))) {
            candidate = `${name} (${counter})${ext}`;
            counter++;
        }

        cb(null, candidate);
    },
});

export const upload = multer({ storage });
