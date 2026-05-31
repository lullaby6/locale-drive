import path from 'path';
import open from 'open';

import { storagePath } from './config.js';
import { asyncHandler } from './utils/async-handler.js';
import * as files from './services/files.js';

const openStoragePath = asyncHandler(async (req, res) => {
    await open(path.resolve(storagePath));

    res.json({ message: 'Storage path opened successfully' });
});

const getFiles = asyncHandler(async (req, res) => {
    const result = await files.listFiles({
        query: req.query?.q || null,
        sort: req.query?.sort || 'modificationDate',
        order: req.query?.order || 'desc',
    });

    res.json(result);
});

const getFile = asyncHandler(async (req, res) => {
    const file = await files.readFile(req.params.filename);

    res.json(file);
});

const deleteFile = asyncHandler(async (req, res) => {
    await files.deleteFile(req.params.filename);

    res.json({ message: 'File deleted successfully' });
});

const downloadFile = asyncHandler(async (req, res, next) => {
    const { stream, filename, size } = await files.getDownloadStream(req.params.filename);

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', size);

    stream.on('error', next);
    stream.pipe(res);
});

const renameFile = asyncHandler(async (req, res) => {
    await files.renameFile(req.params.filename, req.body?.new_filename);

    res.json({ message: 'File renamed successfully' });
});

const uploadFiles = asyncHandler(async (req, res) => {
    res.json({ message: 'Files uploaded successfully' });
});

export {
    openStoragePath,
    getFiles,
    getFile,
    deleteFile,
    downloadFile,
    renameFile,
    uploadFiles,
};
