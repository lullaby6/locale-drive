import { useEffect, useState } from "react";
import type { JSX } from "react";

import { Icon } from "@iconify/react";

import { getT, useT } from "@/i18n";
import useGlobalStore from "@/store/global";
import { formatBytes } from "@/utils/utils";

import type { UploadTask } from "@/types";

function useNow(active: boolean) {
	const [now, setNow] = useState(Date.now());

	useEffect(() => {
		if (!active) return;
		const interval = setInterval(() => setNow(Date.now()), 1000);
		return () => clearInterval(interval);
	}, [active]);

	return now;
}

function formatDuration(seconds: number) {
	if (!Number.isFinite(seconds) || seconds <= 0) return "";
	const t = getT();
	if (seconds < 60) return t.upload.secondsLeft(Math.ceil(seconds));
	if (seconds < 3600) return t.upload.minutesLeft(Math.ceil(seconds / 60));
	return t.upload.hoursLeft((seconds / 3600).toFixed(1));
}

function UploadRow({ upload, now }: { upload: UploadTask; now: number }): JSX.Element {
	const t = useT();
	const cancelUpload = useGlobalStore(state => state.cancelUpload);
	const dismissUpload = useGlobalStore(state => state.dismissUpload);

	const percent = upload.total > 0 ? Math.min(100, Math.round((upload.loaded / upload.total) * 100)) : 0;
	const elapsed = Math.max(0.001, (now - upload.startedAt) / 1000);
	const speed = upload.loaded / elapsed;
	const remaining = speed > 0 ? (upload.total - upload.loaded) / speed : Infinity;

	const title = upload.names.length === 1 ? upload.names[0] : t.common.files(upload.names.length);

	const status = {
		uploading:
			percent >= 100
				? t.upload.processing
				: t.upload.progress(formatBytes(upload.loaded), formatBytes(upload.total), formatBytes(speed), formatDuration(remaining)),
		done: t.upload.done(formatBytes(upload.total)),
		error: upload.error ?? t.upload.failed,
		canceled: t.upload.canceled,
	}[upload.status];

	const icon = {
		uploading: "tabler:upload",
		done: "tabler:circle-check-filled",
		error: "tabler:alert-circle-filled",
		canceled: "tabler:circle-x",
	}[upload.status];

	const iconColor = {
		uploading: "text-primary",
		done: "text-success",
		error: "text-error",
		canceled: "opacity-50",
	}[upload.status];

	return (
		<li className="flex flex-col gap-1.5 px-4 py-3">
			<div className="flex items-center gap-3">
				<Icon icon={icon} width="1em" height="1em" className={`shrink-0 text-xl ${iconColor}`} />

				<div className="flex flex-col min-w-0 grow">
					<span className="text-sm font-medium truncate" title={upload.names.join("\n")}>
						{title}
					</span>
					<span className={`text-xs truncate ${upload.status === "error" ? "text-error" : "opacity-60"}`}>{status}</span>
				</div>

				{upload.status === "uploading" ? (
					<button onClick={() => cancelUpload(upload.id)} className="btn btn-ghost btn-circle btn-xs" aria-label={t.upload.cancel}>
						<Icon icon="tabler:x" width="1em" height="1em" />
					</button>
				) : (
					<button onClick={() => dismissUpload(upload.id)} className="btn btn-ghost btn-circle btn-xs" aria-label={t.upload.dismiss}>
						<Icon icon="tabler:x" width="1em" height="1em" />
					</button>
				)}
			</div>

			{upload.status === "uploading" && (
				<progress className="progress progress-primary h-1.5" value={percent} max={100} />
			)}
		</li>
	);
}

/** Floating panel with the progress of every upload, like Google Drive's bottom-corner card. */
export default (): JSX.Element | null => {
	const t = useT();
	const uploads = useGlobalStore(state => state.uploads);
	const [collapsed, setCollapsed] = useState(false);

	const active = uploads.filter(upload => upload.status === "uploading");
	const now = useNow(active.length > 0);

	if (uploads.length === 0) return null;

	const loaded = active.reduce((sum, upload) => sum + upload.loaded, 0);
	const total = active.reduce((sum, upload) => sum + upload.total, 0);
	const percent = total > 0 ? Math.round((loaded / total) * 100) : 100;

	return (
		<div className="fixed bottom-4 left-4 right-4 sm:right-auto sm:w-96 z-30 rounded-box shadow-xl border border-subtle bg-base-100 overflow-hidden">
			<button
				onClick={() => setCollapsed(value => !value)}
				className="flex items-center justify-between gap-3 w-full px-4 py-3 bg-base-200 cursor-pointer"
				aria-expanded={!collapsed}
			>
				<span className="text-sm font-semibold">
					{active.length > 0
						? t.upload.uploading(active.reduce((sum, upload) => sum + upload.names.length, 0), percent)
						: t.upload.finished}
				</span>
				<Icon icon={collapsed ? "tabler:chevron-up" : "tabler:chevron-down"} width="1em" height="1em" className="text-lg" />
			</button>

			{!collapsed && (
				<ul className="flex flex-col divide-y divide-base-content/10 max-h-72 overflow-y-auto">
					{uploads.map(upload => (
						<UploadRow key={upload.id} upload={upload} now={now} />
					))}
				</ul>
			)}
		</div>
	);
};
