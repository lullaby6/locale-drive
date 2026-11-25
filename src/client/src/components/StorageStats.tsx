import type { JSX } from "react";

import { Icon } from "@iconify/react";

import { useT } from "@/i18n";
import useGlobalStore from "@/store/global";
import { formatBytes } from "@/utils/utils";

export default (): JSX.Element | null => {
	const t = useT();
	const stats = useGlobalStore(state => state.stats);

	if (!stats) return null;

	const disk = stats.disk;
	const usedDisk = disk ? disk.total - disk.free : 0;
	const usedPercent = disk && disk.total > 0 ? Math.round((usedDisk / disk.total) * 100) : 0;
	const barColor = usedPercent >= 90 ? "progress-error" : usedPercent >= 75 ? "progress-warning" : "progress-primary";

	return (
		<div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-sm">
			<div className="flex flex-wrap items-center gap-x-4 gap-y-1 opacity-60">
				<span className="flex items-center gap-1.5">
					<Icon icon="tabler:files" width="1em" height="1em" className="text-base" />
					{t.common.files(stats.files)}
				</span>
				<span className="flex items-center gap-1.5">
					<Icon icon="tabler:folders" width="1em" height="1em" className="text-base" />
					{t.common.folders(stats.folders)}
				</span>
				<span className="flex items-center gap-1.5">
					<Icon icon="tabler:database" width="1em" height="1em" className="text-base" />
					{t.stats.inStorage(formatBytes(stats.bytes))}
				</span>
			</div>

			{disk && (
				<div className="flex flex-col gap-1 sm:w-64" title={t.stats.diskUsed(usedPercent)}>
					<div className="flex justify-between gap-2 text-xs opacity-60">
						<span className="flex items-center gap-1">
							<Icon icon="tabler:device-floppy" width="1em" height="1em" />
							{t.stats.disk}
						</span>
						<span>{t.stats.diskFree(formatBytes(disk.free), formatBytes(disk.total))}</span>
					</div>
					<progress className={`progress ${barColor} h-1.5`} value={usedPercent} max={100} />
				</div>
			)}
		</div>
	);
};
