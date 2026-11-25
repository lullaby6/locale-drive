import { useEffect, useState } from "react";

import { toast } from "react-toastify";

import { getT } from "@/i18n";
import useGlobalStore from "@/store/global";

function hasFiles(event: DragEvent) {
	return Array.from(event.dataTransfer?.types ?? []).includes("Files");
}

/** Lets the user drop files anywhere on the page to upload them to the current folder. */
export default function useFileDrop() {
	const [dragging, setDragging] = useState(false);

	useEffect(() => {
		let depth = 0;

		function onDragEnter(event: DragEvent) {
			if (!hasFiles(event)) return;
			event.preventDefault();
			depth++;
			setDragging(true);
		}

		function onDragOver(event: DragEvent) {
			if (!hasFiles(event)) return;
			event.preventDefault();
			if (event.dataTransfer) event.dataTransfer.dropEffect = "copy";
		}

		function onDragLeave(event: DragEvent) {
			if (!hasFiles(event)) return;
			depth = Math.max(0, depth - 1);
			if (depth === 0) setDragging(false);
		}

		function onDrop(event: DragEvent) {
			if (!hasFiles(event)) return;
			event.preventDefault();
			depth = 0;
			setDragging(false);

			const files: File[] = [];
			let skippedFolders = 0;

			for (const item of Array.from(event.dataTransfer?.items ?? [])) {
				if (item.kind !== "file") continue;

				if (item.webkitGetAsEntry?.()?.isDirectory) {
					skippedFolders++;
					continue;
				}

				const file = item.getAsFile();
				if (file) files.push(file);
			}

			if (skippedFolders > 0) {
				toast.warn(getT().toasts.foldersSkipped(skippedFolders));
			}

			// A folder row/card the files were dropped on sets uploadDir (see useFolderDropTarget).
			const dir = (event as DragEvent & { uploadDir?: string }).uploadDir;

			if (files.length > 0) useGlobalStore.getState().uploadFiles(files, dir);
		}

		window.addEventListener("dragenter", onDragEnter);
		window.addEventListener("dragover", onDragOver);
		window.addEventListener("dragleave", onDragLeave);
		window.addEventListener("drop", onDrop);

		return () => {
			window.removeEventListener("dragenter", onDragEnter);
			window.removeEventListener("dragover", onDragOver);
			window.removeEventListener("dragleave", onDragLeave);
			window.removeEventListener("drop", onDrop);
		};
	}, []);

	return dragging;
}
