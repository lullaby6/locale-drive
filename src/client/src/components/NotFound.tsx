import type { JSX } from "react";

import { Icon } from "@iconify/react";

import { useT } from "@/i18n";

interface ViewProps {
	icon: string;
	title: string;
	body: string;
	actionLabel: string;
	/** Link target (full page) or click handler (inside the app). */
	href?: string;
	onAction?: () => void;
}

/** Card used by both the 404 page and the "folder not found" state. */
export function NotFoundView({ icon, title, body, actionLabel, href, onAction }: ViewProps): JSX.Element {
	const t = useT();

	const action = (
		<>
			<Icon icon="tabler:home" width="1em" height="1em" className="text-lg" />
			{actionLabel}
		</>
	);

	return (
		<div className="flex flex-col items-center gap-4 py-16 px-6 text-center rounded-box border border-subtle bg-base-100">
			<div className="relative">
				<Icon icon={icon} width="1em" height="1em" className="text-7xl text-amber-400" />
				<span className="absolute -bottom-1 -right-4 badge badge-sm badge-neutral font-mono">{t.notFound.code}</span>
			</div>

			<div className="flex flex-col gap-1.5 max-w-md">
				<h1 className="text-xl font-semibold">{title}</h1>
				<p className="text-sm opacity-60 break-words">{body}</p>
			</div>

			{href ? (
				<a href={href} className="btn btn-primary">
					{action}
				</a>
			) : (
				<button onClick={onAction} className="btn btn-primary">
					{action}
				</button>
			)}
		</div>
	);
}

/** Shown for any URL that isn't the app itself (e.g. /something, or a deleted file opened in a tab). */
export default function NotFoundPage(): JSX.Element {
	const t = useT();

	return (
		<main className="flex justify-center items-center min-h-screen p-4 bg-base-300">
			<div className="w-full max-w-lg">
				<NotFoundView
					icon="tabler:folder-question"
					title={t.notFound.pageTitle}
					body={t.notFound.pageBody}
					actionLabel={t.notFound.back}
					href="/"
				/>
			</div>
		</main>
	);
}
