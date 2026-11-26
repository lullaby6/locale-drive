import { useEffect, useState } from "react";
import type { JSX } from "react";

import Icon from "@/components/Icon";

import type { Translations } from "@/i18n";

export interface ShotImage {
	/** Optimized image shown in the page. */
	src: string;
	/** Bigger version for the full-screen viewer. */
	full: string;
	width: number;
	height: number;
}

export interface Shot {
	id: keyof Translations["screenshots"]["tabs"];
	icon: string;
	phone: boolean;
	light: ShotImage;
	dark: ShotImage;
}

/** Both theme versions are rendered; CSS shows the one matching the site theme. */
function ThemedImage({ shot, size, className, alt }: { shot: Shot; size: "src" | "full"; className: string; alt: string }) {
	return (
		<>
			{(["light", "dark"] as const).map(theme => (
				<img
					key={theme}
					src={shot[theme][size]}
					width={shot[theme].width}
					height={shot[theme].height}
					alt={alt}
					loading="lazy"
					decoding="async"
					draggable={false}
					className={`only-${theme} ${className}`}
				/>
			))}
		</>
	);
}

/** Tabs like the app's layout toggle, and a full-screen viewer like its file preview. */
export default ({ shots, t }: { shots: Shot[]; t: Translations["screenshots"] }): JSX.Element => {
	const [index, setIndex] = useState(0);
	const [open, setOpen] = useState(false);

	const shot = shots[index];
	const previous = index > 0 ? index - 1 : null;
	const next = index < shots.length - 1 ? index + 1 : null;

	useEffect(() => {
		if (!open) return;

		function onKeyDown(event: KeyboardEvent) {
			if (event.key === "Escape") setOpen(false);
			if (event.key === "ArrowLeft") setIndex(current => Math.max(0, current - 1));
			if (event.key === "ArrowRight") setIndex(current => Math.min(shots.length - 1, current + 1));
		}

		const overflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		window.addEventListener("keydown", onKeyDown);

		return () => {
			document.body.style.overflow = overflow;
			window.removeEventListener("keydown", onKeyDown);
		};
	}, [open, shots.length]);

	return (
		<div className="flex flex-col gap-4">
			<div className="flex justify-center">
				<div className="join flex-wrap justify-center" role="tablist">
					{shots.map((item, i) => (
						<button
							key={item.id}
							role="tab"
							aria-selected={i === index}
							onClick={() => setIndex(i)}
							className={`btn join-item px-3 sm:px-4 ${i === index ? "btn-primary" : "btn-subtle"}`}
						>
							<Icon icon={item.icon} className="text-lg" />
							<span className="hidden sm:inline">{t.tabs[item.id]}</span>
						</button>
					))}
				</div>
			</div>

			<div className="flex flex-col gap-4 p-3 sm:p-4 rounded-box border border-subtle bg-base-100">
				<button
					type="button"
					onClick={() => setOpen(true)}
					className={`group relative block overflow-hidden rounded-field border border-subtle bg-base-300 cursor-zoom-in ${
						shot.phone ? "mx-auto w-full max-w-[19rem]" : "w-full"
					}`}
					aria-label={`${t.enlarge}: ${t.tabs[shot.id]}`}
				>
					<ThemedImage shot={shot} size="src" alt={t.captions[shot.id]} className="w-full h-auto block" />
					<span className="absolute top-3 right-3 flex justify-center items-center size-9 rounded-full bg-black/55 text-white opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity">
						<Icon icon="tabler:arrows-maximize" className="text-lg" />
					</span>
				</button>

				<p className="flex items-center justify-center gap-2 text-sm opacity-70 text-center">
					<Icon icon={shot.icon} className="text-base text-primary" />
					{t.captions[shot.id]}
				</p>
			</div>

			{open && (
				<div className="fixed inset-0 z-50 flex flex-col bg-black/90 text-white" role="dialog" aria-modal="true" aria-label={t.tabs[shot.id]}>
					<div className="flex items-center gap-3 px-3 sm:px-5 py-3 bg-black/40">
						<button onClick={() => setOpen(false)} className="btn btn-ghost btn-circle btn-sm text-white" aria-label={t.close}>
							<Icon icon="tabler:arrow-left" className="text-xl" />
						</button>

						<Icon icon={shot.icon} className="text-xl" />

						<div className="flex flex-col min-w-0 grow">
							<span className="font-medium truncate">{t.tabs[shot.id]}</span>
							<span className="text-xs opacity-60 truncate">
								{t.captions[shot.id]} · {index + 1} / {shots.length}
							</span>
						</div>

						<button onClick={() => setOpen(false)} className="btn btn-ghost btn-circle text-white" aria-label={t.close}>
							<Icon icon="tabler:x" className="text-xl" />
						</button>
					</div>

					<div
						className="relative grow flex justify-center items-center min-h-0 p-4 sm:px-20 sm:py-6"
						onClick={event => event.target === event.currentTarget && setOpen(false)}
					>
						<ThemedImage shot={shot} size="full" alt={t.captions[shot.id]} className="max-w-full max-h-full w-auto h-auto object-contain rounded-field shadow-xl" />

						{previous !== null && (
							<button
								onClick={() => setIndex(previous)}
								className="btn btn-circle absolute left-2 sm:left-5 top-1/2 -translate-y-1/2 bg-black/50 border-0 text-white hover:bg-black/80"
								aria-label={t.previous}
							>
								<Icon icon="tabler:chevron-left" className="text-2xl" />
							</button>
						)}
						{next !== null && (
							<button
								onClick={() => setIndex(next)}
								className="btn btn-circle absolute right-2 sm:right-5 top-1/2 -translate-y-1/2 bg-black/50 border-0 text-white hover:bg-black/80"
								aria-label={t.next}
							>
								<Icon icon="tabler:chevron-right" className="text-2xl" />
							</button>
						)}
					</div>
				</div>
			)}
		</div>
	);
};
