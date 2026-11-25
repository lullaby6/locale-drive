import type { JSX } from "react";

import { Icon } from "@iconify/react";

import { useT } from "@/i18n";
import useGlobalStore from "@/store/global";

/**
 * Covers the app when the server could not be reached since the page opened.
 * An overlay (not a separate page) so the app underneath keeps its state and hooks.
 */
export function OfflineView(): JSX.Element {
	const t = useT();
	const init = useGlobalStore(state => state.init);

	return (
		<div className="fixed inset-0 z-[80] flex justify-center items-center p-4 bg-base-300" role="alert">
			<div className="flex flex-col items-center gap-5 w-full max-w-lg py-14 px-6 text-center rounded-box border border-subtle bg-base-100">
				<div className="flex justify-center items-center size-20 rounded-full bg-error/10">
					<Icon icon="tabler:plug-connected-x" width="1em" height="1em" className="text-5xl text-error" />
				</div>

				<div className="flex flex-col gap-1.5">
					<h1 className="text-xl font-semibold">{t.connection.offlineTitle}</h1>
					<p className="text-sm opacity-60">{t.connection.offlineBody}</p>
				</div>

				<p className="flex items-center gap-2 text-sm opacity-70">
					<span className="loading loading-spinner loading-xs" />
					{t.connection.retrying}
				</p>

				<button onClick={() => init()} className="btn btn-primary">
					<Icon icon="tabler:refresh" width="1em" height="1em" className="text-lg" />
					{t.connection.retryNow}
				</button>
			</div>
		</div>
	);
}

/** Bar pinned to the top while a connection that was working is down. */
export function ConnectionBanner(): JSX.Element {
	const t = useT();

	return (
		<div
			role="status"
			className="sticky top-0 z-40 -mx-4 sm:-mx-6 lg:-mx-10 -mt-4 sm:-mt-6 lg:-mt-10 mb-0 flex justify-center items-center gap-2 px-4 py-2 text-sm font-medium bg-warning text-warning-content"
		>
			<span className="loading loading-spinner loading-xs" />
			{t.connection.lost}
		</div>
	);
}
