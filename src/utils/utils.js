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
