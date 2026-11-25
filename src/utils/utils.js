import os from 'os';

const PRIVATE_RANGES = [
    /^192\.168\./,
    /^10\./,
    /^172\.(1[6-9]|2\d|3[01])\./,
];

export function getLocalIP() {
    const candidates = [];

    for (const ifaces of Object.values(os.networkInterfaces())) {
        if (!ifaces) continue;

        for (const iface of ifaces) {
            if (iface.family === 'IPv4' && !iface.internal) {
                candidates.push(iface.address);
            }
        }
    }

    const preferred = candidates.find(address => PRIVATE_RANGES.some(range => range.test(address)));

    return preferred || candidates[0] || '127.0.0.1';
}

export function formatBytes(bytes) {
    if (!bytes) return '0 B';
    const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), 5);
    return `${+(bytes / Math.pow(1024, i)).toFixed(2)} ${['B', 'KB', 'MB', 'GB', 'TB', 'PB'][i]}`;
}
