import type { JSX } from "react";

import { Icon } from "@iconify/react";

import { useT } from "@/i18n";
import { getFileKind, getKindIcon } from "@/utils/fileTypes";

import type { Entry } from "@/types";

interface Props {
	entry: Pick<Entry, "name" | "type">;
	className?: string;
}

export default ({ entry, className = "text-2xl" }: Props): JSX.Element => {
	const t = useT();
	const kind = getFileKind(entry);
	const { icon, color } = getKindIcon(kind);

	return <Icon icon={icon} width="1em" height="1em" className={`shrink-0 ${color} ${className}`} aria-label={t.kinds[kind]} />;
};
