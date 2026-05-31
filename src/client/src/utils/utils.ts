import { format } from "@formkit/tempo";

export function formatBytes(bytes: number) {
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${+(bytes / Math.pow(1024, i)).toFixed(2)} ${['B','KB','MB','GB','TB','PB','EB','ZB','YB'][i]}`;
}

export function formatDate(date: string | number | Date) {
    return (
        new Date(date).toLocaleDateString() +
        " " +
        format(new Date(date), "YYYY-MM-DD hh:mm").split(" ")[1]
    );
}

const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'avif', 'ico'];

export function isImage(filename: string) {
    const extension = filename.split('.').pop()?.toLowerCase() ?? '';
    return IMAGE_EXTENSIONS.includes(extension);
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