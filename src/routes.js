import express from 'express';

import { upload } from './middlewares/upload.js';

import {
    getInfo,
    getStats,
    events,
    openStoragePath,
    getEntries,
    createFolder,
    moveEntries,
    duplicateEntry,
    deleteEntries,
    renameEntry,
    downloadFile,
    downloadZip,
    uploadFiles,
    getClipboard,
    setClipboard,
} from './controllers.js';

export default function routes(app) {
    const api = express.Router();

    api.get('/info', getInfo);
    api.get('/stats', getStats);
    api.get('/events', events);

    api.get('/open', openStoragePath);

    api.get('/entries', getEntries);
    api.post('/folder', createFolder);
    api.post('/move', moveEntries);
    api.post('/duplicate', duplicateEntry);
    api.post('/delete', deleteEntries);
    api.put('/rename', renameEntry);

    api.get('/download', downloadFile);
    api.get('/zip', downloadZip);
    // Submitted as a native form so the browser handles the download (and big selections fit).
    api.post('/zip', express.urlencoded({ extended: true, limit: '2mb' }), downloadZip);
    api.post('/upload', upload.array('file'), uploadFiles);

    api.get('/clipboard', getClipboard);
    api.put('/clipboard', setClipboard);

    api.use((req, res) => {
        res.status(404).json({ message: 'Not found', code: 'NOT_FOUND' });
    });

    app.use('/api', api);

    return app;
}
