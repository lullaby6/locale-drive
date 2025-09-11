import axios from "axios";

import { format } from "@formkit/tempo"

import { formatBytes } from '@/utils/utils'

const API_URL = import.meta.env.VITE_API_URL;

export async function getFiles(search: string = "") {
	const response = await axios.get(`${API_URL}/files?search=${search}`);

	const data = response.data.map((file: any) => {
		return {
			...file,
			modificationDate:
				new Date(file.modificationDate).toLocaleDateString() +
				" " +
				format(new Date(file.creationDate), "YYYY-MM-DD hh:mm").split(
					" "
				)[1],
			creationDate: new Date(file.creationDate).toLocaleDateString(),
			size: formatBytes(file.size),
		};
	});

	return data;
}

export async function deleteFile(fileName: string) {
	axios.delete(`${API_URL}/file/${fileName}`);
}

export async function downloadFile(fileName: string) {
	const response = await axios.get(`${API_URL}/download/${fileName}`, {
		responseType: "arraybuffer",
	});

	const buffer = Buffer.from(response.data, "binary");

	const a = document.createElement("a");
	const blob = new Blob([buffer]);
	a.href = URL.createObjectURL(blob);
	a.download = fileName;
	document.body.appendChild(a);
	a.click();
	a.remove();
}

export async function renameFile(fileName: string, newFileName: string) {
	axios.put(`${API_URL}/rename/${fileName}`, {
		new_filename: newFileName,
	});
}

export async function uploadFile(file: File) {
	const formData = new FormData();
	formData.append("file", file);

	axios.post(`${API_URL}/upload`, formData);
}

export async function openStoragePath() {
	axios.get(`${API_URL}/open`);
}
