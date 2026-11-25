import { useState } from "react";
import type { DragEvent } from "react";

import { getT } from "@/i18n";
import useGlobalStore from "@/store/global";

import type { Entry } from "@/types";

const INTERNAL_TYPE = "application/x-locale-drive";

/** Set synchronously on dragstart: drop targets must know what is dragged on the very first dragover. */
let draggedPaths: string[] = [];

function parentOf(path: string) {
	const index = path.lastIndexOf("/");
	return index === -1 ? "" : path.slice(0, index);
}

/** A folder can receive the dragged items unless it is one of them, inside one of them, or already their parent. */
function canReceive(target: string, dragged: string[]) {
	if (dragged.length === 0) return false;
	if (dragged.some(path => target === path || target.startsWith(`${path}/`))) return false;
	return !dragged.every(path => parentOf(path) === target);
}

function isExternalFileDrag(event: DragEvent) {
	return Array.from(event.dataTransfer.types).includes("Files");
}

/** Shows "3 items" next to the cursor when dragging a multiple selection. */
function setCountDragImage(event: DragEvent, count: number) {
	const badge = document.createElement("div");
	badge.textContent = getT().entries.dragItems(count);
	badge.style.cssText =
		"position:fixed;top:-100px;left:-100px;padding:6px 12px;border-radius:999px;font:600 13px system-ui,sans-serif;" +
		"background:oklch(58% 0.233 277.117);color:white;box-shadow:0 4px 12px rgba(0,0,0,.25);";
	document.body.appendChild(badge);
	event.dataTransfer.setDragImage(badge, -12, -12);
	setTimeout(() => badge.remove(), 0);
}

/** Makes a file or folder draggable. Dragging a selected item drags the whole selection. */
export function useDraggableEntry(entry: Entry) {
	return {
		draggable: true,
		onDragStart: (event: DragEvent) => {
			const { selected, setDragging } = useGlobalStore.getState();
			const paths = selected.includes(entry.path) ? selected : [entry.path];

			event.dataTransfer.effectAllowed = "move";
			event.dataTransfer.setData(INTERNAL_TYPE, JSON.stringify(paths));
			event.dataTransfer.setData("text/plain", entry.name);

			if (paths.length > 1) setCountDragImage(event, paths.length);

			draggedPaths = paths;

			// Dimming is deferred so the browser takes the drag snapshot before the item fades.
			setTimeout(() => setDragging(paths), 0);
		},
		onDragEnd: () => {
			draggedPaths = [];
			useGlobalStore.getState().setDragging([]);
		},
	};
}

/**
 * Makes a folder (row, card or breadcrumb) accept dropped items: entries dragged inside the app
 * are moved into it, and files dragged from the computer are uploaded into it.
 */
export function useFolderDropTarget(folderPath: string) {
	const [isOver, setIsOver] = useState(false);

	function accepts(event: DragEvent) {
		if (isExternalFileDrag(event)) return true;
		return canReceive(folderPath, draggedPaths);
	}

	return {
		isOver,
		dropProps: {
			onDragOver: (event: DragEvent) => {
				if (!accepts(event)) return;
				event.preventDefault();
				event.dataTransfer.dropEffect = isExternalFileDrag(event) ? "copy" : "move";
				if (!isOver) setIsOver(true);
			},
			onDragLeave: (event: DragEvent) => {
				if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsOver(false);
			},
			onDrop: (event: DragEvent) => {
				setIsOver(false);

				if (isExternalFileDrag(event)) {
					// The page-wide drop handler (useFileDrop) does the upload; tell it which folder to use.
					(event.nativeEvent as DragEvent["nativeEvent"] & { uploadDir?: string }).uploadDir = folderPath;
					return;
				}

				const paths = draggedPaths;
				if (!canReceive(folderPath, paths)) return;

				event.preventDefault();
				event.stopPropagation();

				draggedPaths = [];
				useGlobalStore.getState().setDragging([]);
				useGlobalStore.getState().moveEntries(paths, folderPath);
			},
		},
	};
}
