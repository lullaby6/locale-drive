import type { JSX } from "react";

import { Icon } from "@iconify/react";

import ThemeSwitcher from "@/components/ThemeSwitcher";

import useGlobalStore from "@/store/global";

export default (): JSX.Element => {
	const storagePath = useGlobalStore(state => state.storagePath);
	const loading = useGlobalStore(state => state.loading);
	const openStorage = useGlobalStore(state => state.openStorage);

	return (
		<div className="flex justify-between items-center gap-3 p-4 rounded shadow-sm border border-base-200 bg-base-300">
			<div className="flex items-center gap-3 pr-3 rounded bg-base-200 overflow-hidden">
				<button
					className="btn btn-primary"
					onClick={openStorage}
					disabled={loading}
				>
					<Icon
						icon="tabler:folder-share"
						width="1em"
						height="1em"
						className="text-xl"
					/>
					Open
				</button>

				<p className="font-semibold truncate">{storagePath}</p>
			</div>

			<ThemeSwitcher />
		</div>
	);
};
