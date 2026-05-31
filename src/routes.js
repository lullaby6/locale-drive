import { upload } from './middlewares/upload.js';

import {
    openStoragePath,
    getFiles,
    getFile,
    deleteFile,
    downloadFile,
    renameFile,
    uploadFiles,
} from './controllers.js';

export default function routes(app) {
    app.get('/open', openStoragePath);
    app.get('/files', getFiles);
    app.get('/file/:filename', getFile);
    app.delete('/file/:filename', deleteFile);
    app.get('/download/:filename', downloadFile);
    app.put('/rename/:filename', renameFile);
    app.post('/upload', upload.array('file'), uploadFiles);

    return app;
}
