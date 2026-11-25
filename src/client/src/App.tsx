import { useEffect, useRef } from "react";

import { ToastContainer } from "react-toastify";
import { Tooltip } from "react-tooltip";
import "react-toastify/dist/ReactToastify.css";

import Header from "@/components/Header";
import Toolbar from "@/components/Toolbar";
import LocationBar from "@/components/LocationBar";
import Table from "@/components/Table";
import Grid from "@/components/Grid";
import EmptyState from "@/components/EmptyState";
import PreviewModal from "@/components/PreviewModal";
import UploadPanel from "@/components/UploadPanel";
import DropOverlay from "@/components/DropOverlay";
import Dialogs from "@/components/dialogs/Dialogs";
import { ConnectionBanner, OfflineView } from "@/components/Connection";
import { NotFoundView } from "@/components/NotFound";

import useFileDrop from "@/hooks/useFileDrop";
import useKeyboardShortcuts from "@/hooks/useKeyboardShortcuts";
import useMarqueeSelection from "@/hooks/useMarqueeSelection";
import useServerEvents from "@/hooks/useServerEvents";
import { useT } from "@/i18n";
import useGlobalStore from "@/store/global";

export default () => {
	const t = useT();
	const connection = useGlobalStore(state => state.connection);
	const everConnected = useGlobalStore(state => state.everConnected);
	const missingDir = useGlobalStore(state => state.missingDir);
	const navigate = useGlobalStore(state => state.navigate);
	const loading = useGlobalStore(state => state.loading);
	const entries = useGlobalStore(state => state.entries);
	const view = useGlobalStore(state => state.view);
	const init = useGlobalStore(state => state.init);
	const syncDirFromHash = useGlobalStore(state => state.syncDirFromHash);

	const contentRef = useRef<HTMLDivElement>(null);

	const dragging = useFileDrop();
	const marquee = useMarqueeSelection(contentRef);
	useServerEvents();
	useKeyboardShortcuts();

	const initialized = useRef(false);

	useEffect(() => {
		if (initialized.current) return;
		initialized.current = true;

		init();
	}, [init]);

	useEffect(() => {
		window.addEventListener("hashchange", syncDirFromHash);
		return () => window.removeEventListener("hashchange", syncDirFromHash);
	}, [syncDirFromHash]);

	return (
		<main className="flex flex-col gap-4 p-4 sm:p-6 lg:p-10 bg-base-300 min-h-screen">
			{loading && (
				<div className="fixed inset-0 z-[60] flex justify-center items-center bg-black/30">
					<span className="loading loading-spinner loading-lg text-primary"></span>
				</div>
			)}

			{everConnected && connection === "offline" && <ConnectionBanner />}

			<Header />
			<Toolbar />
			<LocationBar />

			{/* Grows to fill the page so there is always empty space to start a selection box. */}
			<div ref={contentRef} className="flex flex-col grow pb-16">
				{missingDir !== null ? (
					<NotFoundView
						icon="tabler:folder-x"
						title={t.notFound.folderTitle}
						body={t.notFound.folderBody(missingDir)}
						actionLabel={t.notFound.back}
						onAction={() => navigate("")}
					/>
				) : entries.length === 0 ? (
					<EmptyState />
				) : view === "grid" ? (
					<Grid entries={entries} />
				) : (
					<Table entries={entries} />
				)}
			</div>

			{marquee && (
				<div
					className="fixed z-20 pointer-events-none rounded-sm border border-primary bg-primary/15"
					style={{ left: marquee.left, top: marquee.top, width: marquee.width, height: marquee.height }}
				/>
			)}

			<PreviewModal />
			<Dialogs />
			<UploadPanel />
			{dragging && <DropOverlay />}

			<Tooltip id="tooltip" place="top" delayShow={300} className="z-[70]" />

			{!everConnected && connection === "offline" && <OfflineView />}

			<ToastContainer position="bottom-right" autoClose={3000} pauseOnHover closeOnClick theme="colored" />
		</main>
	);
};
