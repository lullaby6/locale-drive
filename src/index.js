#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import express from 'express';
import cors from 'cors';
import qrcode from 'qrcode-terminal';
import open from 'open';

import { port, storagePath, openBrowser } from './config.js';
import { getLocalIP } from './utils/utils.js';
import { errorHandler } from './middlewares/error-handler.js';
import { watchStorage } from './services/events.js';
import routes from './routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicPath = path.join(__dirname, './public');

if (!fs.existsSync(storagePath)) fs.mkdirSync(storagePath, { recursive: true });

const app = express();

app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.static(publicPath));

// Serves files for previews. express.static supports Range requests (video seeking, resumable reads).
app.use('/storage', express.static(storagePath, { dotfiles: 'allow', index: false, redirect: false }));

routes(app);

// Unknown pages (and missing files opened in a tab) get the app with a 404 status,
// which then shows its own "page not found" screen. Images, scripts etc. keep a plain 404.
app.use((req, res, next) => {
    // Only real page navigations ask for text/html explicitly (images send "*/*", which would match accepts('html')).
    const wantsPage = req.headers.accept?.includes('text/html');
    if ((req.method !== 'GET' && req.method !== 'HEAD') || !wantsPage) return next();

    res.status(404).sendFile(path.join(publicPath, 'index.html'));
});

app.use(errorHandler);

watchStorage();

app.listen(port, () => {
    const URL = `http://${getLocalIP()}:${port}`;

    console.log(`Storage path: ${path.resolve(storagePath)}`);
    console.log(`Server listening on: ${URL}`);

    qrcode.generate(URL, { small: true }, qr => console.log(qr));

    if (openBrowser) open(URL);
});
