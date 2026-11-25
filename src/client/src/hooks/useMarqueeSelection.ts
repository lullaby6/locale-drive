import { useEffect, useState } from "react";
import type { RefObject } from "react";

import useGlobalStore from "@/store/global";

export interface MarqueeRect {
	left: number;
	top: number;
	width: number;
	height: number;
}

const START_DISTANCE = 5;
const AUTO_SCROLL_EDGE = 48;
const AUTO_SCROLL_STEP = 18;

/** Clicks on these never start a selection box. */
const IGNORE = 'button, a, input, textarea, select, label, [draggable="true"], .dropdown, [role="dialog"]';

/**
 * Click and drag on empty space to select every file/folder the box touches, like Google Drive
 * or the Windows explorer. Ctrl/Cmd/Shift add to the current selection. A plain click on empty
 * space clears the selection. Items are found through their `data-entry-path` attribute.
 */
export default function useMarqueeSelection(containerRef: RefObject<HTMLElement | null>) {
	const [rect, setRect] = useState<MarqueeRect | null>(null);

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		let start: { x: number; y: number } | null = null;
		let pointer = { x: 0, y: 0 };
		let base: string[] = [];
		let additive = false;
		let active = false;

		function update() {
			if (!start) return;

			// Page coordinates, so the box stays anchored while the page scrolls.
			const current = { x: pointer.x + window.scrollX, y: pointer.y + window.scrollY };
			const left = Math.min(start.x, current.x);
			const top = Math.min(start.y, current.y);
			const right = Math.max(start.x, current.x);
			const bottom = Math.max(start.y, current.y);

			setRect({ left: left - window.scrollX, top: top - window.scrollY, width: right - left, height: bottom - top });

			const hits: string[] = [];

			container!.querySelectorAll<HTMLElement>("[data-entry-path]").forEach(element => {
				const box = element.getBoundingClientRect();
				const boxLeft = box.left + window.scrollX;
				const boxTop = box.top + window.scrollY;

				if (boxLeft < right && boxLeft + box.width > left && boxTop < bottom && boxTop + box.height > top) {
					hits.push(element.dataset.entryPath!);
				}
			});

			useGlobalStore.getState().setSelected(Array.from(new Set([...base, ...hits])));
		}

		function onMouseMove(event: MouseEvent) {
			if (!start) return;

			pointer = { x: event.clientX, y: event.clientY };

			if (!active) {
				const dx = event.pageX - start.x;
				const dy = event.pageY - start.y;
				if (Math.hypot(dx, dy) < START_DISTANCE) return;

				active = true;
				document.body.style.userSelect = "none";
				window.getSelection()?.removeAllRanges();
			}

			event.preventDefault();

			if (event.clientY < AUTO_SCROLL_EDGE) window.scrollBy(0, -AUTO_SCROLL_STEP);
			else if (event.clientY > window.innerHeight - AUTO_SCROLL_EDGE) window.scrollBy(0, AUTO_SCROLL_STEP);

			update();
		}

		function onScroll() {
			if (active) update();
		}

		// Rows become draggable as soon as they get selected. Without this, the browser would start a
		// native drag of the row under the cursor mid-box, swallow the mouseup and leave the box stuck.
		function blockNativeDrag(event: DragEvent) {
			if (!start) return;
			event.preventDefault();
			// Also keep it from reaching React's onDragStart, which would mark the row as being dragged.
			event.stopPropagation();
		}

		function swallowClick(event: MouseEvent) {
			event.stopPropagation();
			event.preventDefault();
		}

		function onMouseUp(event: MouseEvent) {
			window.removeEventListener("mousemove", onMouseMove);
			window.removeEventListener("mouseup", onMouseUp);
			window.removeEventListener("scroll", onScroll);
			window.removeEventListener("dragstart", blockNativeDrag, true);

			if (active) {
				// The click that follows the drag must not toggle or open the item under the cursor.
				window.addEventListener("click", swallowClick, true);
				setTimeout(() => window.removeEventListener("click", swallowClick, true), 0);
			} else if (!additive && !(event.target as HTMLElement).closest("[data-entry-path]")) {
				useGlobalStore.getState().clearSelection();
			}

			document.body.style.userSelect = "";
			start = null;
			active = false;
			setRect(null);
		}

		function onMouseDown(event: MouseEvent) {
			if (event.button !== 0) return;
			if ((event.target as HTMLElement).closest(IGNORE)) return;

			start = { x: event.pageX, y: event.pageY };
			pointer = { x: event.clientX, y: event.clientY };
			additive = event.ctrlKey || event.metaKey || event.shiftKey;
			base = additive ? useGlobalStore.getState().selected : [];
			active = false;

			window.addEventListener("mousemove", onMouseMove);
			window.addEventListener("mouseup", onMouseUp);
			window.addEventListener("scroll", onScroll);
			window.addEventListener("dragstart", blockNativeDrag, true);
		}

		container.addEventListener("mousedown", onMouseDown);

		return () => {
			container.removeEventListener("mousedown", onMouseDown);
			window.removeEventListener("mousemove", onMouseMove);
			window.removeEventListener("mouseup", onMouseUp);
			window.removeEventListener("scroll", onScroll);
			window.removeEventListener("dragstart", blockNativeDrag, true);
			document.body.style.userSelect = "";
		};
	}, [containerRef]);

	return rect;
}
