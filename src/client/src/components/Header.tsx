import type { JSX } from "react";

import { Icon } from "@iconify/react";

import LanguageSwitcher from "@/components/LanguageSwitcher";
import StorageStats from "@/components/StorageStats";
import ThemeSwitcher from "@/components/ThemeSwitcher";

import { useT } from "@/i18n";
import useGlobalStore from "@/store/global";

const GITHUB_URL = "https://github.com/lullaby6/locale-drive";

function IconButton({ icon, label, onClick, href, dot = false }: { icon: string; label: string; onClick?: () => void; href?: string; dot?: boolean }) {
	const className = "btn btn-ghost btn-square relative";
	const content = (
		<>
			<Icon icon={icon} width="1em" height="1em" className="text-xl" />
			{dot && <span className="absolute top-2 right-2 size-2 rounded-full bg-primary" />}
		</>
	);

	return href ? (
		<a href={href} target="_blank" rel="noreferrer" className={className} aria-label={label} data-tooltip-id="tooltip" data-tooltip-content={label}>
			{content}
		</a>
	) : (
		<button onClick={onClick} className={className} aria-label={label} data-tooltip-id="tooltip" data-tooltip-content={label}>
			{content}
		</button>
	);
}

export default (): JSX.Element => {
	const t = useT();
	const realPath = useGlobalStore(state => state.realPath);
	const loading = useGlobalStore(state => state.loading);
	const openFolder = useGlobalStore(state => state.openFolder);
	const openDialog = useGlobalStore(state => state.openDialog);
	const hasClipboard = useGlobalStore(state => state.clipboard.text !== "");

	return (
		<header className="flex flex-col gap-4 p-4 rounded-box border border-subtle bg-base-100">
			<div className="flex flex-col sm:flex-row justify-between items-center gap-3">
				<div className="w-full sm:w-auto sm:flex-1 min-w-0 sm:max-w-fit flex items-center gap-3 pr-3 rounded-field border border-subtle bg-base-200 overflow-hidden">
					<button
						className="btn btn-primary rounded-r-none"
						onClick={openFolder}
						disabled={loading}
						data-tooltip-id="tooltip"
						data-tooltip-content={t.header.openTooltip}
					>
						<Icon icon="tabler:folder-share" width="1em" height="1em" className="text-xl" />
						{t.common.open}
					</button>

					<p className="text-sm font-medium truncate" title={realPath}>
						{realPath}
					</p>
				</div>

				<div className="flex flex-wrap sm:flex-nowrap sm:shrink-0 justify-center items-center gap-1">
					<IconButton icon="tabler:qrcode" label={t.header.connect} onClick={() => openDialog({ kind: "qr" })} />
					<IconButton
						icon="tabler:clipboard-text"
						label={t.header.clipboard}
						onClick={() => openDialog({ kind: "clipboard" })}
						dot={hasClipboard}
					/>
					<IconButton
						icon="tabler:keyboard"
						label={t.shortcuts.button}
						onClick={() => openDialog({ kind: "shortcuts" })}
					/>
					<IconButton icon="tabler:brand-github" label={t.header.github} href={GITHUB_URL} />
					<LanguageSwitcher />
					<div className="ml-1">
						<ThemeSwitcher />
					</div>
				</div>
			</div>

			<StorageStats />
		</header>
	);
};
