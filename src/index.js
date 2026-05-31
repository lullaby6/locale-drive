#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import express from 'express';
import cors from 'cors';
import qrcode from 'qrcode-terminal';
import open from 'open';

import { port, storagePath } from './config.js';
import { getLocalIP } from './utils/utils.js';
import { errorHandler } from './middlewares/error-handler.js';
import routes from './routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicPath = path.join(__dirname, './public');

if (!fs.existsSync(storagePath)) fs.mkdirSync(storagePath, { recursive: true });

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(publicPath));
app.use('/storage', express.static(storagePath));

routes(app);

app.use(errorHandler);

app.listen(port, () => {
    const URL = `http://${getLocalIP()}:${port}`;

    console.log(`Storage path: ${path.resolve(storagePath)}`);
    console.log(`Server listening on: ${URL}`);

    qrcode.generate(URL, { small: true }, qr => console.log(qr));

    open(URL);
});
