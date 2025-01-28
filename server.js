import fs from "fs";
import path from "path";

import yargs from "yargs";
import {hideBin} from "yargs/helpers";

import express from "express";
import cors from "cors";
import multer from 'multer';

const argv = yargs(hideBin(process.argv))
    .option('port', {
        alias: 'p',
        type: 'number',
        description: 'El puerto para el servidor',
        default: 3000,
    })
    .option('storage', {
        alias: 's',
        type: 'string',
        description: 'Directorio donde se almacenaran los archivos',
        default: './storage/',
    })
    .help()
    .argv;

const port = argv.port || 3000;

const storagePath = argv.storage;

const app = express();

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

app.use(cors())
app.use(express.json());

app.use(express.static('public'));
app.use('/storage', express.static(storagePath));

if (!fs.existsSync(storagePath)) fs.mkdirSync(storagePath);

app.get('/files', async (req, res) => {
    const query = req.query?.q || null;

    try {
        const dirents = await fs.promises.readdir(storagePath, { withFileTypes: true });

        const filesInfo = []

        await Promise.all(
            dirents.map(async dirent => {
                const filename = dirent.name;
                const filePath = path.join(storagePath, filename);
                const stats = await fs.promises.stat(filePath);

                if (dirent.isDirectory()) return
                if (query && !filename.toLowerCase().includes(query.toLowerCase())) return

                const content = await fs.promises.readFile(filePath);

                filesInfo.push({
                    filename,
                    filePath,
                    realFilePath: path.resolve(filePath),
                    content: content.toString(),
                    size: content.byteLength,
                    creationDate: stats.birthtime,
                    modificationDate: stats.mtime,
                });
            })
        );

        res.json({
            files: filesInfo,
            path: storagePath,
            realPath: path.resolve(storagePath),
        });
    } catch (error) {
        res.status(500).json({
            message: "Error getting files",
            error: error.message,
        });
    }
});

app.get('/file/:filename', async (req, res) => {
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
})

app.delete('/file/:filename', async (req, res) => {
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
})

app.get('/download/:filename', async (req, res) => {
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
})

app.put('/rename/:filename', async (req, res) => {
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
})

app.post('/upload', upload.array('file'), async (req, res) => {
    try {
        res.json({ message: 'Archivos subidos exitosamente' });
    } catch (error) {
        res.status(500).json({
            message: 'Error subiendo archivos',
            error: error.message
        });
    }
});

app.listen(port, () => {
    console.log(`Server listening on ${port}`)
})