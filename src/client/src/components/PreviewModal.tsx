import { useEffect, useState } from "react";
import type { JSX } from "react";

import { Icon } from "@iconify/react";

import EntryIcon from "@/components/EntryIcon";
import { useT } from "@/i18n";
import { getFileUrl } from "@/services/files";
import useGlobalStore from "@/store/global";
import { getFileKind, getPreviewKind } from "@/utils/fileTypes";
import { formatBytes, formatDate } from "@/utils/utils";

import type { Entry } from "@/types";

/** Only the first part of big text files is shown, fetched with a Range request. */
const TEXT_PREVIEW_BYTES = 512 * 1024;

function TextPreview({ entry, url }: { entry: Entry; url: string }): JSX.Element {
	const t = useT();
	const [state, setState] = useState<{ text: string; truncated: boolean } | "loading" | "error">("loading");

	useEffect(() => {
		if (entry.size === 0) {
			setState({ text: "", truncated: false });
			return;
		}

		const controller = new AbortController();
		const truncated = entry.size > TEXT_PREVIEW_BYTES;

		setState("loading");

		fetch(url, {
			signal: controller.signal,
			headers: truncated ? { Range: `bytes=0-${TEXT_PREVIEW_BYTES - 1}` } : undefined,
		})
			.then(response => {
				if (!response.ok) throw new Error(response.statusText);
				return response.arrayBuffer();
			})
			.then(buffer => setState({ text: new TextDecoder().decode(buffer), truncated }))
			.catch(() => {
				if (!controller.signal.aborted) setState("error");
			});

		return () => controller.abort();
	}, [entry.size, url]);

	if (state === "loading") return <span className="loading loading-spinner loading-lg text-white" />;
	if (state === "error") return <NoPreview entry={entry} message={t.preview.couldNotLoad} />;

	return (
		<div className="flex flex-col w-full max-w-5xl h-full rounded-box overflow-hidden bg-base-100 text-base-content shadow-xl">
			{state.truncated && (
				<div className="flex items-center gap-2 px-4 py-2 text-xs bg-warning/15 text-warning">
					<Icon icon="tabler:info-circle" width="1em" height="1em" />
					{t.preview.truncated(formatBytes(TEXT_PREVIEW_BYTES), formatBytes(entry.size))}
				</div>
			)}
			<pre className="grow overflow-auto p-4 text-sm font-mono whitespace-pre-wrap break-words">
				{state.text === "" ? <span className="opacity-50">{t.preview.emptyFile}</span> : state.text}
			</pre>
		</div>
	);
}

function NoPreview({ entry, message }: { entry: Entry; message?: string }): JSX.Element {
	const t = useT();
	const download = useGlobalStore(state => state.download);
	const label = t.kinds[getFileKind(entry)];

	return (
		<div className="flex flex-col items-center gap-4 p-8 rounded-box bg-base-100 text-base-content text-center max-w-sm shadow-xl">
			<EntryIcon entry={entry} className="text-7xl" />
			<div className="flex flex-col gap-1">
				<p className="font-semibold">{message ?? t.preview.noPreview}</p>
				<p className="text-sm opacity-70">
					{label} · {formatBytes(entry.size)}
				</p>
			</div>
			<button onClick={() => download([entry])} className="btn btn-primary">
				<Icon icon="tabler:download" width="1em" height="1em" className="text-lg" />
				{t.common.download}
			</button>
		</div>
	);
}

function Content({ entry }: { entry: Entry }): JSX.Element {
	const t = useT();
	const [failed, setFailed] = useState(false);

	const kind = getPreviewKind(entry);
	const url = `${getFileUrl(entry.path)}?v=${new Date(entry.modificationDate).getTime()}`;

	if (failed) return <NoPreview entry={entry} message={t.preview.cantPlay} />;

	switch (kind) {
		case "image":
			return (
				<img
					src={url}
					alt={entry.name}
					onError={() => setFailed(true)}
					className="max-w-full max-h-full object-contain select-none shadow-xl"
					draggable={false}
				/>
			);
		case "video":
			return (
				<video
					key={url}
					src={url}
					controls
					autoPlay
					playsInline
					onError={() => setFailed(true)}
					className="max-w-full max-h-full bg-black shadow-xl"
				/>
			);
		case "audio":
			return (
				<div className="flex flex-col items-center gap-6 p-8 rounded-box bg-base-100 text-base-content w-full max-w-md shadow-xl">
					<EntryIcon entry={entry} className="text-8xl" />
					<p className="font-semibold text-center break-all">{entry.name}</p>
					<audio key={url} src={url} controls autoPlay onError={() => setFailed(true)} className="w-full" />
				</div>
			);
		case "pdf":
			return <iframe src={getFileUrl(entry.path)} title={entry.name} className="w-full max-w-5xl h-full rounded-box bg-white shadow-xl" />;
		case "text":
			return <TextPreview entry={entry} url={url} />;
		default:
			return <NoPreview entry={entry} />;
	}
}

/** Full-screen viewer, like Google Drive's: arrows (or ← →) move between the files of the folder. */
export default (): JSX.Element | null => {
	const t = useT();
	const preview = useGlobalStore(state => state.preview);
	const entries = useGlobalStore(state => state.entries);
	const setPreview = useGlobalStore(state => state.setPreview);
	const download = useGlobalStore(state => state.download);

	const files = entries.filter(entry => entry.type === "file");
	const index = preview ? files.findIndex(entry => entry.path === preview.path) : -1;

	// Use the freshest version of the entry (it may have been renamed or re-uploaded).
	const entry = index >= 0 ? files[index] : preview;
	const previous = index > 0 ? files[index - 1] : null;
	const next = index >= 0 && index < files.length - 1 ? files[index + 1] : null;

	useEffect(() => {
		if (!entry) return;

		function onKeyDown(event: KeyboardEvent) {
			if (event.key === "Escape") setPreview(null);
			if ((event.target as HTMLElement)?.closest?.("video, audio")) return;
			if (event.key === "ArrowLeft" && previous) setPreview(previous);
			if (event.key === "ArrowRight" && next) setPreview(next);
		}

		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [entry, previous, next, setPreview]);

	const isOpen = Boolean(entry);

	useEffect(() => {
		if (!isOpen) return;

		const overflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";

		return () => {
			document.body.style.overflow = overflow;
		};
	}, [isOpen]);

	if (!entry) return null;

	return (
		<div className="fixed inset-0 z-40 flex flex-col bg-black/90 text-white" role="dialog" aria-modal="true" aria-label={entry.name}>
			<div className="flex items-center gap-3 px-3 sm:px-5 py-3 bg-black/40">
				<button onClick={() => setPreview(null)} className="btn btn-ghost btn-circle btn-sm text-white" aria-label={t.preview.close}>
					<Icon icon="tabler:arrow-left" width="1em" height="1em" className="text-xl" />
				</button>

				<EntryIcon entry={entry} className="text-xl" />

				<div className="flex flex-col min-w-0 grow">
					<span className="font-medium truncate">{entry.name}</span>
					<span className="text-xs opacity-60 truncate">
						{formatBytes(entry.size)} · {formatDate(entry.modificationDate)}
						{files.length > 1 && index >= 0 ? ` · ${t.preview.position(index + 1, files.length)}` : ""}
					</span>
				</div>

				<a
					href={getFileUrl(entry.path)}
					target="_blank"
					rel="noreferrer"
					className="btn btn-ghost btn-circle text-white"
					aria-label={t.common.openInNewTab}
					data-tooltip-id="tooltip"
					data-tooltip-content={t.common.openInNewTab}
				>
					<Icon icon="tabler:external-link" width="1em" height="1em" className="text-xl" />
				</a>
				<button
					onClick={() => download([entry])}
					className="btn btn-ghost btn-circle text-white"
					aria-label={t.common.download}
					data-tooltip-id="tooltip"
					data-tooltip-content={t.common.download}
				>
					<Icon icon="tabler:download" width="1em" height="1em" className="text-xl" />
				</button>
				<button onClick={() => setPreview(null)} className="btn btn-ghost btn-circle text-white" aria-label={t.common.close}>
					<Icon icon="tabler:x" width="1em" height="1em" className="text-xl" />
				</button>
			</div>

			<div
				className="relative grow flex justify-center items-center min-h-0 p-4 sm:px-20 sm:py-6"
				onClick={event => event.target === event.currentTarget && setPreview(null)}
			>
				<Content key={entry.path} entry={entry} />

				{previous && (
					<button
						onClick={() => setPreview(previous)}
						className="btn btn-circle absolute left-2 sm:left-5 top-1/2 -translate-y-1/2 bg-black/50 border-0 text-white hover:bg-black/80"
						aria-label={t.preview.previous}
					>
						<Icon icon="tabler:chevron-left" width="1em" height="1em" className="text-2xl" />
					</button>
				)}
				{next && (
					<button
						onClick={() => setPreview(next)}
						className="btn btn-circle absolute right-2 sm:right-5 top-1/2 -translate-y-1/2 bg-black/50 border-0 text-white hover:bg-black/80"
						aria-label={t.preview.next}
					>
						<Icon icon="tabler:chevron-right" width="1em" height="1em" className="text-2xl" />
					</button>
				)}
			</div>
		</div>
	);
};
