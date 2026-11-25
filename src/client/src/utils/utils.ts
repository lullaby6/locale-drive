import { getLanguage, getT } from "@/i18n";

export { formatBytes } from "@/utils/format";

export function formatDate(date: string | number | Date) {
	return new Date(date).toLocaleString(getLanguage(), {
		dateStyle: "short",
		timeStyle: "short",
	});
}

/**
 * True when the server could not be reached at all: no response, or the 502/503/504
 * that the Vite dev proxy answers with while the Express server is down.
 */
export function isNetworkError(error: any) {
	if (!error || error.code === "ERR_CANCELED") return false;
	const status = error.response?.status;
	if (!error.response) return true;
	if (status === 502 || status === 503 || status === 504) return true;
	return status === 500 && !error.response.data?.message;
}

/** Uses the server's error `code` to show the message in the current language. */
export function getAxiosRequestErrorMessage(error: any): string {
	if (isNetworkError(error)) return getT().connection.networkError;

	const data = error?.response?.data;
	const translate = data?.code ? (getT().errors as Record<string, (params: any) => string>)[data.code] : undefined;

	if (translate) return translate(data.params ?? {});
	if (data?.message) return data.message;

	return error?.message || getT().toasts.genericError;
}

/** Copies text to the clipboard. Falls back to execCommand because navigator.clipboard needs HTTPS, and the app runs over plain HTTP on the LAN. */
export async function copyText(text: string) {
	if (navigator.clipboard && window.isSecureContext) {
		await navigator.clipboard.writeText(text);
		return;
	}

	const textarea = document.createElement("textarea");
	textarea.value = text;
	textarea.setAttribute("readonly", "");
	textarea.style.position = "fixed";
	textarea.style.opacity = "0";
	document.body.appendChild(textarea);
	textarea.select();

	const ok = document.execCommand("copy");
	textarea.remove();

	if (!ok) throw new Error("Could not copy to the clipboard");
}

export function joinPath(dir: string, name: string) {
	return dir ? `${dir}/${name}` : name;
}

export function splitPath(path: string) {
	return path.split("/").filter(Boolean);
}

export function baseName(path: string) {
	return splitPath(path).pop() ?? "";
}
