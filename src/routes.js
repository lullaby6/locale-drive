import multer from 'multer';
import path from 'path';
import fs from 'fs';

import { storagePath } from "./config.js";

import {
    getFiles,
    getFile,
    deleteFile,
    downloadFile,
    renameFile,
    uploadFiles
} from "./controllers.js"

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, storagePath);
    },
    filename: async (req, file, cb) => {
        const fileInfo = path.parse(file.originalname);
        let newName = file.originalname;
        let counter = 1;

        while (fs.existsSync(path.join(storagePath, newName))) {
            newName = `${fileInfo.name} (${counter})${fileInfo.ext}`;
            counter++;
        }

        cb(null, newName);
    }
});

const upload = multer({ storage });

export default function routes(app) {
    app.get('/files', getFiles)
    app.get('/file/:filename', getFile)
    app.delete('/file/:filename', deleteFile)
    app.get('/download/:filename', downloadFile)
    app.put('/rename/:filename', renameFile)
    app.post('/upload', upload.array('file'), uploadFiles)

    return app
}