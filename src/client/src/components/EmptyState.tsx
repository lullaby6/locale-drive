import type { JSX } from "react";

import { Icon } from "@iconify/react";

import { useT } from "@/i18n";
import useGlobalStore from "@/store/global";

export default (): JSX.Element => {
	const t = useT();
	const query = useGlobalStore(state => state.query);
	const fetching = useGlobalStore(state => state.fetching);

	if (fetching) {
		return (
			<div className="flex justify-center items-center py-20 rounded-box border border-subtle bg-base-100">
				<span className="loading loading-spinner loading-lg text-primary" />
			</div>
		);
	}

	return (
		<div className="flex flex-col items-center gap-3 py-16 px-6 text-center rounded-box border border-dashed border-base-content/15 bg-base-100">
			<Icon
				icon={query ? "tabler:search-off" : "tabler:cloud-upload"}
				width="1em"
				height="1em"
				className="text-6xl text-primary/70"
			/>
			<p className="text-lg font-semibold">{query ? t.empty.noResults : t.empty.folder}</p>
			<p className="text-sm opacity-60 max-w-sm">{query ? t.empty.noResultsHint(query) : t.empty.folderHint}</p>
		</div>
	);
};
