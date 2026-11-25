import path from 'path';
import open from 'open';

import { maxUploadBytes, port } from './config.js';
import { asyncHandler } from './utils/async-handler.js';
import { getLocalIP } from './utils/utils.js';
import { statExistingDir } from './utils/storage.js';
import * as files from './services/files.js';
import * as clipboard from './services/clipboard.js';
import { subscribe, notifyChange } from './services/events.js';

/** Accepts `?path=a&path=b`, a form body with repeated `path` fields, or a JSON body `{ paths: [...] }`. */
function getPaths(req) {
    const paths = req.body?.paths ?? req.body?.path ?? req.query?.path;
    if (paths === undefined) return [];
    return Array.isArray(paths) ? paths : [paths];
}

const getInfo = (req, res) => {
    res.json({
        url: `http://${getLocalIP()}:${port}`,
        maxUploadBytes,
    });
};

const getStats = asyncHandler(async (req, res) => {
    res.json(await files.getStats());
});

const events = (req, res) => subscribe(req, res);

const openStoragePath = asyncHandler(async (req, res) => {
    const { safePath } = await statExistingDir(req.query?.dir || '');

    await open(path.resolve(safePath));

    res.json({ message: 'Folder opened successfully' });
});

const getEntries = asyncHandler(async (req, res) => {
    const result = await files.listEntries({
        dir: req.query?.dir || '',
        query: req.query?.q || null,
        sort: req.query?.sort || 'modificationDate',
        order: req.query?.order || 'desc',
    });

    res.json(result);
});

const createFolder = asyncHandler(async (req, res) => {
    const folder = await files.createFolder(req.body?.dir || '', req.body?.name);
    notifyChange();

    res.status(201).json({ message: `Folder "${folder.name}" created`, path: folder.path });
});

const moveEntries = asyncHandler(async (req, res) => {
    const count = await files.moveEntries(getPaths(req), req.body?.destination);
    if (count > 0) notifyChange();

    res.json({ message: count === 1 ? 'Moved successfully' : `${count} items moved successfully`, count });
});

const duplicateEntry = asyncHandler(async (req, res) => {
    const copy = await files.duplicateEntry(req.body?.path);
    notifyChange();

    res.status(201).json({ message: `Duplicated as "${copy.name}"`, path: copy.path });
});

const deleteEntries = asyncHandler(async (req, res) => {
    const count = await files.deleteEntries(getPaths(req));
    notifyChange();

    res.json({ message: count === 1 ? 'Deleted successfully' : `${count} items deleted successfully` });
});

const renameEntry = asyncHandler(async (req, res) => {
    const newPath = await files.renameEntry(req.body?.path, req.body?.name);
    notifyChange();

    res.json({ message: 'Renamed successfully', path: newPath });
});

const downloadFile = asyncHandler(async (req, res, next) => {
    const { safePath, filename } = await files.getDownloadFile(req.query?.path);

    // res.download streams the file and supports Range requests, so downloads can be resumed.
    res.download(safePath, filename, { dotfiles: 'allow' }, error => {
        if (error && !res.headersSent) next(error);
    });
});

const downloadZip = asyncHandler(async (req, res) => {
    const { filename, createArchive } = await files.prepareZip(getPaths(req));

    res.attachment(filename);
    res.setHeader('Content-Type', 'application/zip');

    const archive = createArchive();

    archive.on('warning', () => {});
    archive.on('error', () => res.destroy());
    req.on('close', () => {
        if (!res.writableEnded) archive.abort();
    });

    archive.pipe(res);
});

const uploadFiles = asyncHandler(async (req, res) => {
    notifyChange();

    const count = req.files?.length || 0;

    res.json({ message: count === 1 ? 'File uploaded successfully' : `${count} files uploaded successfully` });
});

const getClipboard = (req, res) => {
    res.json(clipboard.getClipboard());
};

const setClipboard = asyncHandler(async (req, res) => {
    res.json(clipboard.setClipboard(req.body?.text));
});

export {
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
};
