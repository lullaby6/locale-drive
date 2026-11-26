#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import express from 'express';
import cors from 'cors';
import qrcode from 'qrcode-terminal';
import open from 'open';

import { DEFAULT_PORT, port, portIsExplicit, runtime, storagePath, openBrowser } from './config.js';
import { getLocalIP } from './utils/utils.js';
import { errorHandler } from './middlewares/error-handler.js';
import { watchStorage } from './services/events.js';
import routes from './routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicPath = path.join(__dirname, './public');

if (!fs.existsSync(storagePath)) fs.mkdirSync(storagePath, { recursive: true });

// The web app is built from the locale-drive-frontend repo (git submodule) into src/public.
const frontendBuilt = fs.existsSync(path.join(publicPath, 'index.html'));

if (!frontendBuilt) {
    console.warn('\nThe web app is not built yet (src/public/index.html is missing). The API works, but there is no page to open.');
    console.warn('Build it with:  npm run setup && npm run build\n');
}

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
    if ((req.method !== 'GET' && req.method !== 'HEAD') || !wantsPage || !frontendBuilt) return next();

    res.status(404).sendFile(path.join(publicPath, 'index.html'));
});

app.use(errorHandler);

watchStorage();

const MAX_PORT_ATTEMPTS = 10;

function listen(candidate) {
    return new Promise((resolve, reject) => {
        const server = app.listen(candidate);
        server.once('listening', () => resolve(server));
        server.once('error', reject);
    });
}

function exitWithError(error, candidate) {
    if (error.code === 'EADDRINUSE') {
        console.error(`\nPort ${candidate} is already in use by another app.`);
        console.error(`Close that app, or choose another port:  locale-drive --port ${candidate + 1}\n`);
    } else if (error.code === 'EACCES') {
        console.error(`\nNo permission to use port ${candidate} (ports below 1024 usually need admin rights).`);
        console.error(`Choose another port:  locale-drive --port ${DEFAULT_PORT}\n`);
    } else {
        console.error(`\nCould not start the server: ${error.message}\n`);
    }

    process.exit(1);
}

/**
 * Starts on the configured port. When the user didn't ask for a specific port and the default one
 * is taken, it tries the next ones and finally lets the OS pick any free port. The app itself
 * doesn't care which port it ends up on: the page is served by this same server and calls the API
 * with relative URLs. The QR code and links use the real port.
 */
async function start() {
    let candidate = port;

    for (let attempt = 0; ; attempt++) {
        try {
            return await listen(candidate);
        } catch (error) {
            if (error.code !== 'EADDRINUSE' || portIsExplicit) exitWithError(error, candidate);

            const next = attempt + 1 < MAX_PORT_ATTEMPTS ? candidate + 1 : 0;
            console.log(`Port ${candidate} is in use, trying ${next === 0 ? 'any free port' : next}...`);

            if (next === 0) {
                try {
                    return await listen(0);
                } catch (lastError) {
                    exitWithError(lastError, candidate);
                }
            }

            candidate = next;
        }
    }
}

const server = await start();

runtime.port = server.address().port;

const URL = `http://${getLocalIP()}:${runtime.port}`;

console.log(`Storage path: ${path.resolve(storagePath)}`);
console.log(`Server listening on: ${URL}`);

qrcode.generate(URL, { small: true }, qr => console.log(qr));

// "?connect" makes the app open with the QR code dialog showing, ready to scan from a phone.
if (openBrowser) open(`${URL}/?connect`);
