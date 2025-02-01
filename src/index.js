import fs from "fs";
import path from "path";
import express from "express";
import cors from "cors";
import ip from 'ip';
import qrcode from 'qrcode-terminal'

import { port, storagePath } from "./config.js";

import routes from "./routes.js";

const app = express();

app.use(cors())
app.use(express.json());

app.use(express.static('./src/public'));
app.use('/storage', express.static(storagePath));

if (!fs.existsSync(storagePath)) fs.mkdirSync(storagePath);

routes(app);

app.listen(port, async () => {
    const protocol = 'http';

    const URL = `${protocol}://${ip.address()}:${port}`;

    console.log(`Storage path: ${path.resolve(storagePath)}`);

    console.log(`Server listening on: ${URL}`);

    qrcode.generate(URL, {small: true}, qrcode => {
        console.log(qrcode)
    });
})