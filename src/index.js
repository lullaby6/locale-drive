#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import express from "express";
import cors from "cors";
import os from "os";
import qrcode from 'qrcode-terminal'
import open from 'open';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicPath = path.join(__dirname, './public');

import { port, storagePath } from "./config.js";

import routes from "./routes.js";

const app = express();

app.use(cors())
app.use(express.json());

app.use(express.static(publicPath));
app.use('/storage', express.static(storagePath));

if (!fs.existsSync(storagePath)) fs.mkdirSync(storagePath);

routes(app);

function getLocalIP() {
    const interfaces = os.networkInterfaces();

    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {

                if (iface.address.startsWith('192.168.')) {
                    return iface.address;
                }
            }
        }
    }

    return '127.0.0.1';
}

app.listen(port, async () => {
    const protocol = 'http';

    const IP = getLocalIP();

    const URL = `${protocol}://${IP}:${port}`;

    console.log(`Storage path: ${path.resolve(storagePath)}`);

    console.log(`Server listening on: ${URL}`);

    qrcode.generate(URL, { small: true }, qrcode => {
        console.log(qrcode)
    });

    open(URL);
});