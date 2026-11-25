import { useState } from "react";
import type { JSX } from "react";

import { Icon } from "@iconify/react";

import EntryIcon from "@/components/EntryIcon";
import useInView from "@/hooks/useInView";
import { getFileUrl } from "@/services/files";
import { getPreviewKind } from "@/utils/fileTypes";

import type { Entry } from "@/types";

interface Props {
	entry: Entry;
	/** Size classes for the box, e.g. "size-10" or "w-full h-full". */
	className?: string;
	/** Icon size classes used when there is no visual preview. */
	iconClassName?: string;
}

/** Image or video frame for media files, a file-type icon for everything else. */
export default ({ entry, className = "size-10", iconClassName = "text-2xl" }: Props): JSX.Element => {
	const [ref, inView] = useInView<HTMLDivElement>();
	const [failed, setFailed] = useState(false);

	const kind = getPreviewKind(entry);
	const url = getFileUrl(entry.path);
	const isMedia = (kind === "image" || kind === "video") && !failed;

	// Re-fetch the thumbnail when the file changes (same name, new content).
	const version = new Date(entry.modificationDate).getTime();

	return (
		<div ref={ref} className={`relative flex justify-center items-center overflow-hidden shrink-0 ${className}`}>
			{isMedia && inView ? (
				kind === "image" ? (
					<img
						src={`${url}?v=${version}`}
						alt=""
						loading="lazy"
						decoding="async"
						onError={() => setFailed(true)}
						className="w-full h-full object-cover select-none pointer-events-none"
						draggable={false}
					/>
				) : (
					<>
						<video
							src={`${url}?v=${version}#t=0.5`}
							preload="metadata"
							muted
							playsInline
							onError={() => setFailed(true)}
							className="w-full h-full object-cover pointer-events-none bg-black"
						/>
						<span className="absolute inset-0 flex justify-center items-center">
							<span className="flex justify-center items-center rounded-full bg-black/55 text-white p-1">
								<Icon icon="tabler:player-play-filled" width="1em" height="1em" />
							</span>
						</span>
					</>
				)
			) : (
				<EntryIcon entry={entry} className={iconClassName} />
			)}
		</div>
	);
};
