import { useEffect } from "react";

import useGlobalStore from "@/store/global";
import { splitPath } from "@/utils/utils";

import type { Entry } from "@/types";

export const isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

function entryElements() {
	return Array.from(document.querySelectorAll<HTMLElement>("[data-entry-path]"));
}

function elementFor(path: string | null) {
	if (path === null) return null;
	return entryElements().find(element => element.dataset.entryPath === path) ?? null;
}

/**
 * Up/Down follow what is on screen: the next row in the list, or the card right
 * above/below in the grid (also jumping between the Folders and Files sections).
 */
function verticalNeighbor(current: HTMLElement, direction: 1 | -1) {
	const from = current.getBoundingClientRect();
	const fromX = from.left + from.width / 2;
	const fromY = from.top + from.height / 2;

	const candidates = entryElements()
		.filter(element => element !== current)
		.map(element => {
			const box = element.getBoundingClientRect();
			return { element, dy: (box.top + box.height / 2 - fromY) * direction, dx: Math.abs(box.left + box.width / 2 - fromX) };
		})
		.filter(candidate => candidate.dy > 4);

	if (candidates.length === 0) return null;

	const nearestRow = Math.min(...candidates.map(candidate => candidate.dy));
	const sameRow = candidates.filter(candidate => candidate.dy <= nearestRow + 4);

	return sameRow.reduce((best, candidate) => (candidate.dx < best.dx ? candidate : best)).element.dataset.entryPath ?? null;
}

function isTyping(target: EventTarget | null) {
	const element = target as HTMLElement | null;
	if (!element?.closest) return false;
	if (element instanceof HTMLInputElement && element.type === "checkbox") return false;
	return Boolean(element.closest('input, textarea, select, [contenteditable="true"]'));
}

/** Keys that a focused button/link/checkbox already handles natively. */
function isNativeActivation(event: KeyboardEvent) {
	if (event.key !== "Enter" && event.key !== " ") return false;
	return Boolean((event.target as HTMLElement | null)?.closest?.('button, a, input, [role="button"]'));
}

/**
 * File-explorer style shortcuts (press "?" in the app to see them all):
 * Ctrl+A, Esc, arrows (+Shift to extend, +Ctrl to move without selecting), Space,
 * Home/End, Enter, Backspace, Delete, F2, Ctrl+D, Ctrl+S, Shift+N, Shift+U, V, "/" and "?".
 */
export default function useKeyboardShortcuts() {
	useEffect(() => {
		function onKeyDown(event: KeyboardEvent) {
			const state = useGlobalStore.getState();

			// Dialogs and the preview have their own keys (Esc, ←, →).
			if (state.dialog || state.preview) return;
			if (event.defaultPrevented || event.isComposing) return;
			if (isTyping(event.target) || isNativeActivation(event)) return;

			const ctrl = isMac ? event.metaKey : event.ctrlKey;
			const key = event.key;
			const { entries, selected, cursor } = state;

			/** What actions apply to: the selection, or else the item under the keyboard cursor. */
			const targets: Entry[] = selected.length > 0
				? entries.filter(entry => selected.includes(entry.path))
				: entries.filter(entry => entry.path === cursor);

			const single = targets.length === 1 ? targets[0] : null;

			const handled = () => {
				event.preventDefault();
				event.stopPropagation();
			};

			function moveTo(path: string | null, mode: "select" | "extend" | "cursor") {
				if (path === null) return;

				const latest = useGlobalStore.getState();

				if (mode === "extend") {
					const anchor = latest.anchor ?? latest.cursor ?? path;
					const from = entries.findIndex(entry => entry.path === anchor);
					const to = entries.findIndex(entry => entry.path === path);
					const [start, end] = from <= to ? [from, to] : [to, from];

					latest.setCursor(path, { keepAnchor: true });
					latest.setSelected(entries.slice(start, end + 1).map(entry => entry.path));
				} else {
					latest.setCursor(path);
					if (mode === "select") latest.setSelected([path]);
				}

				elementFor(path)?.scrollIntoView({ block: "nearest", inline: "nearest" });
			}

			const mode = event.shiftKey ? "extend" : ctrl ? "cursor" : "select";
			const index = entries.findIndex(entry => entry.path === cursor);

			// --- Selection -------------------------------------------------------
			if (ctrl && key.toLowerCase() === "a") {
				handled();
				state.setSelected(entries.map(entry => entry.path));
				return;
			}

			if (key === "Escape") {
				if (selected.length === 0 && !state.cursorVisible) return;
				handled();
				state.clearSelection();
				state.hideCursor();
				return;
			}

			// --- Moving around ---------------------------------------------------
			if (key === "ArrowDown" || key === "ArrowUp" || key === "ArrowRight" || key === "ArrowLeft") {
				if (event.altKey) {
					if (key === "ArrowUp" && state.dir) {
						handled();
						state.navigate(splitPath(state.dir).slice(0, -1).join("/"));
					}
					return;
				}
				if (entries.length === 0) return;
				handled();

				// First press only shows where the cursor is.
				if (index === -1) {
					moveTo(entries[0].path, mode);
					return;
				}

				const step = key === "ArrowDown" || key === "ArrowRight" ? 1 : -1;
				let next: string | null = null;

				if (key === "ArrowDown" || key === "ArrowUp") {
					const current = elementFor(cursor);
					next = current ? verticalNeighbor(current, step) : null;
				} else {
					next = entries[index + step]?.path ?? null;
				}

				moveTo(next ?? cursor, mode);
				return;
			}

			if (key === "Home" || key === "End") {
				if (entries.length === 0) return;
				handled();
				moveTo((key === "Home" ? entries[0] : entries[entries.length - 1]).path, mode);
				return;
			}

			if (key === " " && cursor) {
				handled();
				state.toggleSelected(cursor);
				state.setCursor(cursor);
				return;
			}

			if (key === "Enter" && single) {
				handled();
				state.openEntry(single);
				return;
			}

			if (key === "Backspace" && !ctrl && state.dir) {
				handled();
				state.navigate(splitPath(state.dir).slice(0, -1).join("/"));
				return;
			}

			// --- Actions ---------------------------------------------------------
			if ((key === "Delete" || (isMac && ctrl && key === "Backspace")) && targets.length > 0) {
				handled();
				state.openDialog({ kind: "delete", paths: targets.map(entry => entry.path) });
				return;
			}

			if (key === "F2" && single) {
				handled();
				state.openDialog({ kind: "rename", entry: single });
				return;
			}

			if (ctrl && key.toLowerCase() === "d" && single) {
				handled();
				state.openDialog({ kind: "duplicate", entry: single });
				return;
			}

			if (ctrl && key.toLowerCase() === "s" && targets.length > 0) {
				handled();
				state.download(targets);
				return;
			}

			if (event.shiftKey && !ctrl && !event.altKey && key.toLowerCase() === "n") {
				handled();
				state.openDialog({ kind: "newFolder" });
				return;
			}

			if (event.shiftKey && !ctrl && !event.altKey && key.toLowerCase() === "u") {
				handled();
				document.getElementById("files")?.click();
				return;
			}

			if (!ctrl && !event.altKey && !event.shiftKey && key.toLowerCase() === "v") {
				handled();
				state.setView(state.view === "list" ? "grid" : "list");
				return;
			}

			if (key === "/" || (ctrl && key.toLowerCase() === "k")) {
				handled();
				const search = document.getElementById("search") as HTMLInputElement | null;
				search?.focus();
				search?.select();
				return;
			}

			if (key === "?") {
				handled();
				state.openDialog({ kind: "shortcuts" });
			}
		}

		// Any mouse use hides the keyboard cursor ring again.
		function onMouseDown() {
			useGlobalStore.getState().hideCursor();
		}

		window.addEventListener("keydown", onKeyDown);
		window.addEventListener("mousedown", onMouseDown, true);

		return () => {
			window.removeEventListener("keydown", onKeyDown);
			window.removeEventListener("mousedown", onMouseDown, true);
		};
	}, []);
}
