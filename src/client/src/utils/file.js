function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${+(bytes / Math.pow(1024, i)).toFixed(2)} ${['B','KB','MB','GB','TB','PB','EB','ZB','YB'][i]}`;
}

export {
    formatBytes,
}