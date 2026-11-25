import fs from 'fs';

import { storageRoot } from '../utils/storage.js';

const PING_INTERVAL = 25000;
const CHANGE_DEBOUNCE = 300;

const clients = new Set();
const changeListeners = new Set();

let changeTimeout = null;

function send(res, event, data) {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data ?? {})}\n\n`);
}

export function broadcast(event, data) {
    for (const res of clients) send(res, event, data);
}

/** Notifies every client that the storage changed. Debounced so bursts become one event. */
export function notifyChange() {
    if (changeTimeout) clearTimeout(changeTimeout);

    changeTimeout = setTimeout(() => {
        changeTimeout = null;
        for (const listener of changeListeners) listener();
        broadcast('change');
    }, CHANGE_DEBOUNCE);
}

export function onChange(listener) {
    changeListeners.add(listener);
}

export function subscribe(req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
        'X-Accel-Buffering': 'no',
    });
    res.write('retry: 3000\n\n');

    clients.add(res);
    send(res, 'ready');

    const ping = setInterval(() => res.write(': ping\n\n'), PING_INTERVAL);

    req.on('close', () => {
        clearInterval(ping);
        clients.delete(res);
    });
}

/** Watches the storage folder so changes made outside the app (e.g. in the file explorer) show up live. */
export function watchStorage() {
    try {
        const watcher = fs.watch(storageRoot, { recursive: true }, notifyChange);
        watcher.on('error', () => {});
    } catch {
        try {
            fs.watch(storageRoot, notifyChange).on('error', () => {});
        } catch {
            // Watching is a nice-to-have; changes made through the API still notify clients.
        }
    }
}
