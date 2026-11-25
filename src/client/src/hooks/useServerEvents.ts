import { useEffect } from "react";

import { EVENTS_URL } from "@/services/files";
import useGlobalStore from "@/store/global";

import type { SharedClipboard } from "@/types";

const RETRY_MIN = 2000;
const RETRY_MAX = 10000;

/**
 * Keeps every open tab in sync through Server-Sent Events: when anyone uploads, renames or
 * deletes (or the folder changes on disk), the listing and stats refresh without reloading.
 *
 * The stream also tells whether the server is reachable: an error marks the app offline and
 * a new connection marks it online again (which refreshes whatever was missed).
 */
export default function useServerEvents() {
	useEffect(() => {
		let source: EventSource | null = null;
		let retryTimeout: ReturnType<typeof setTimeout> | null = null;
		let retryDelay = RETRY_MIN;
		let disposed = false;

		function scheduleReconnect() {
			if (disposed || retryTimeout) return;

			retryTimeout = setTimeout(() => {
				retryTimeout = null;
				connect();
			}, retryDelay);

			retryDelay = Math.min(retryDelay * 1.5, RETRY_MAX);
		}

		function connect() {
			source?.close();
			source = new EventSource(EVENTS_URL);

			const { refresh, fetchStats, receiveClipboard } = useGlobalStore.getState();

			source.addEventListener("ready", () => {
				retryDelay = RETRY_MIN;
				useGlobalStore.getState().markOnline();
			});

			source.addEventListener("change", () => {
				refresh({ silent: true });
				fetchStats();
			});

			source.addEventListener("clipboard", event => {
				try {
					receiveClipboard(JSON.parse((event as MessageEvent).data) as SharedClipboard);
				} catch {
					// ignore malformed events
				}
			});

			source.onerror = () => {
				useGlobalStore.getState().markOffline();

				// The browser retries a dropped stream by itself, but gives up for good after an
				// error response (e.g. 502 from the dev proxy). Recreate it ourselves in that case.
				if (source?.readyState === EventSource.CLOSED) scheduleReconnect();
			};
		}

		connect();

		return () => {
			disposed = true;
			if (retryTimeout) clearTimeout(retryTimeout);
			source?.close();
		};
	}, []);
}
