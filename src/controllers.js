import path from 'path';
import fs from 'fs';
// import os from 'os';
// import { exec } from 'child_process';
import open from 'open';

import { storagePath } from "./config.js";

// function openDir(path) {
//     return new Promise((resolve, reject) => {
//         const platform = os.platform();
//         let cmd;

//         if (platform === "win32") {
//             cmd = `start "" "${path}"`;
//         } else if (platform === "darwin") {
//             cmd = `open "${path}"`;
//         } else {
//             cmd = `xdg-open "${path}"`;
//         }

//         exec(cmd, (err) => {
//             if (err) {
//                 return reject(err);
//             }

//             // console.log(`Opened ${path}`);

//             resolve();
//         });
//     });
// }

async function openStoragePath(req, res) {
    try {
        // openDir(path.resolve(storagePath));
        open(path.resolve(storagePath));

        res.status(200).json({
            message: "Storage path opened successfully",
        })
    } catch (error) {
        res.status(500).json({
            message: "Error opening storage path",
            error: error.message,
        });
    }
}

async function getFiles(req, res) {
    const query = req.query?.q || null;

    try {
        const dirents = await fs.promises.readdir(storagePath, { withFileTypes: true });

        const files = []

        await Promise.all(
            dirents.map(async dirent => {
                const filename = dirent.name;
                const filePath = path.join(storagePath, filename);
                const stats = await fs.promises.stat(filePath);

                if (dirent.isDirectory()) return
                if (query && !filename.toLowerCase().includes(query.toLowerCase())) return

                const content = await fs.promises.readFile(filePath);

                files.push({
                    filename,
                    filePath,
                    realFilePath: path.resolve(filePath),
                    // content: content.toString(),
                    size: content.byteLength,
                    creationDate: stats.birthtime,
                    modificationDate: stats.mtime,
                });
            })
        );

        res.json({
            files,
            path: storagePath,
            realPath: path.resolve(storagePath),
        });
    } catch (error) {
        res.status(500).json({
            message: "Error getting files",
            error: error.message,
        });
    }
}

async function getFile(req, res) {
    const filename = req.params.filename;
    const filePath = path.join(storagePath, filename);

    if (!fs.existsSync(filePath)) {
        res.status(404).send('File not found');
        return;
    }

    if (fs.lstatSync(filePath).isDirectory()) {
        res.status(400).json({
            message: 'Cannot download directory'
        });
        return;
    }

    const file = await fs.promises.readFile(filePath);

    res.json({
        filename: filename,
        filePath: filePath,
        realFilePath: path.resolve(filePath),
        content: file.toString(),
        size: file.byteLength,
        creationDate: file.birthtime,
        modificationDate: file.mtime
    });
}

async function deleteFile(req, res) {
const filename = req.params.filename;
    const filePath = path.join(storagePath, filename);

    if (!fs.existsSync(filePath)) {
        res.status(404).json({
            message: 'File not found'
        });
        return;
    }

    if (fs.lstatSync(filePath).isDirectory()) {
        res.status(400).json({
            message: 'Cannot delete directory'
        });
        return;
    }

    try {
        await fs.promises.unlink(filePath);

        res.json({
            message: 'File deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error deleting file',
            error: error.message
        });
    }
}

async function downloadFile(req, res) {
const filename = req.params.filename;
    const filePath = path.join(storagePath, filename);

    if (!fs.existsSync(filePath)) {
        res.status(404).json({
            message: 'File not found'
        })
        return;
    }

    if (fs.lstatSync(filePath).isDirectory()) {
        res.status(400).json({
            message: 'Cannot download directory'
        });
        return;
    }

    try {
        const file = await fs.promises.readFile(filePath, 'binary');

        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

        res.send(Buffer.from(file, 'binary'));
    } catch (error) {
        res.status(500).json({
            message: 'Error downloading file',
            error: error.message
        });
    }
}

async function renameFile(req, res) {
    const filename = req.params.filename;
    const newFilename = req.body.newFilename;
    const filePath = path.join(storagePath, filename);

    if (!fs.existsSync(filePath)) {
        res.status(404).json({
            message: 'File not found'
        });
        return;
    }

    if (fs.lstatSync(filePath).isDirectory()) {
        res.status(400).json({
            message: 'Cannot rename directory'
        });
        return;
    }

    try {
        await fs.promises.rename(filePath, path.join(storagePath, newFilename));

        res.json({
            message: 'File renamed successfully'
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error renaming file',
            error: error.message
        });
    }
}

async function uploadFiles(req, res) {
    try {
        res.json({ message: 'Archivos subidos exitosamente' });
    } catch (error) {
        res.status(500).json({
            message: 'Error subiendo archivos',
            error: error.message
        });
    }
}

export {
    openStoragePath,
    getFiles,
    getFile,
    deleteFile,
    downloadFile,
    renameFile,
    uploadFiles
}