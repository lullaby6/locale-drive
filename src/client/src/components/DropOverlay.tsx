import type { JSX } from "react";

import { Icon } from "@iconify/react";

import { useT } from "@/i18n";
import useGlobalStore from "@/store/global";
import { splitPath } from "@/utils/utils";

export default (): JSX.Element => {
	const t = useT();
	const dir = useGlobalStore(state => state.dir);
	const folderName = splitPath(dir).pop() ?? t.common.storage;

	return (
		<div className="fixed inset-0 z-50 p-4 pointer-events-none">
			<div className="flex flex-col justify-end items-center gap-3 pb-10 w-full h-full rounded-box border-2 border-dashed border-primary bg-primary/10">
				<div className="flex flex-col items-center gap-3 px-8 py-6 rounded-box bg-base-100 shadow-xl">
					<Icon icon="tabler:cloud-upload" width="1em" height="1em" className="text-6xl text-primary" />
					<p className="text-lg font-bold">{t.drop.title}</p>
					<p className="flex items-center gap-1.5 opacity-70">
						{t.drop.to}
						<Icon icon="tabler:folder" width="1em" height="1em" />
						<b>{folderName}</b>
					</p>
				</div>
			</div>
		</div>
	);
};
