import { useEffect } from "react";
import type { JSX, ReactNode } from "react";

import { Icon } from "@iconify/react";

import { useT } from "@/i18n";

interface Props {
	title: string;
	icon?: string;
	onClose: () => void;
	children: ReactNode;
	actions?: ReactNode;
	className?: string;
}

export default ({ title, icon, onClose, children, actions, className = "" }: Props): JSX.Element => {
	const t = useT();

	useEffect(() => {
		function onKeyDown(event: KeyboardEvent) {
			if (event.key === "Escape") onClose();
		}

		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [onClose]);

	return (
		<div className="modal modal-open modal-bottom sm:modal-middle" role="dialog" aria-modal="true" aria-label={title}>
			<div className={`modal-box flex flex-col gap-4 border border-subtle ${className}`}>
				<div className="flex justify-between items-center gap-3">
					<h3 className="flex items-center gap-2 text-lg font-bold">
						{icon && <Icon icon={icon} width="1em" height="1em" className="text-primary" />}
						{title}
					</h3>
					<button onClick={onClose} className="btn btn-ghost btn-circle btn-sm" aria-label={t.common.close}>
						<Icon icon="tabler:x" width="1em" height="1em" className="text-lg" />
					</button>
				</div>

				{children}

				{actions && <div className="modal-action mt-0">{actions}</div>}
			</div>

			<div className="modal-backdrop" onClick={onClose} />
		</div>
	);
};
