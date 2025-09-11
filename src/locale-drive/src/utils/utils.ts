export function formatBytes(bytes: number) {
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${+(bytes / Math.pow(1024, i)).toFixed(2)} ${['B','KB','MB','GB','TB','PB','EB','ZB','YB'][i]}`;
}

export function getAxiosRequestErrorMessage(error: any) {
    let message = error.message;
    if (error.response) message = error.response.data.message;
    return message;
}

export function getFormData(form: any) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    return data;
}