import type { JSX } from "react";

import { Icon } from "@iconify/react";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "react-toastify";

import Modal from "@/components/Modal";
import { useT } from "@/i18n";
import useGlobalStore from "@/store/global";
import { copyText } from "@/utils/utils";

export default ({ onClose }: { onClose: () => void }): JSX.Element => {
	const t = useT();
	const info = useGlobalStore(state => state.info);

	const url = info?.url ?? window.location.origin;

	async function handleCopy() {
		try {
			await copyText(url);
			toast.success(t.qr.copied);
		} catch {
			toast.error(t.qr.copyFailed);
		}
	}

	return (
		<Modal title={t.qr.title} icon="tabler:qrcode" onClose={onClose} className="sm:max-w-sm">
			<p className="text-sm opacity-70">{t.qr.hint}</p>

			<div className="self-center p-4 rounded-box bg-white">
				<QRCodeSVG value={url} size={220} marginSize={0} />
			</div>

			<div className="join w-full">
				<input value={url} readOnly className="input join-item w-full font-mono text-sm" onFocus={event => event.target.select()} />
				<button onClick={handleCopy} className="btn btn-primary join-item" aria-label={t.qr.copyLink}>
					<Icon icon="tabler:copy" width="1em" height="1em" className="text-lg" />
				</button>
			</div>
		</Modal>
	);
};
