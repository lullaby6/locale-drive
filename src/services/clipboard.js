import { HttpError } from '../utils/http-error.js';
import { broadcast } from './events.js';

const MAX_CLIPBOARD_LENGTH = 500_000;

// Kept in memory on purpose: the shared clipboard is a quick hand-off, not storage.
let clipboard = { text: '', updatedAt: null };

export function getClipboard() {
    return clipboard;
}

export function setClipboard(text) {
    if (typeof text !== 'string') throw new HttpError(400, 'Clipboard text must be a string', 'INVALID_REQUEST');

    if (text.length > MAX_CLIPBOARD_LENGTH) {
        throw new HttpError(413, `Clipboard text cannot be longer than ${MAX_CLIPBOARD_LENGTH} characters`, 'CLIPBOARD_TOO_LONG', { max: MAX_CLIPBOARD_LENGTH });
    }

    clipboard = { text, updatedAt: new Date().toISOString() };
    broadcast('clipboard', clipboard);

    return clipboard;
}
