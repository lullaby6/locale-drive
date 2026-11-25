import type { JSX, MouseEvent } from "react";

interface Props {
	checked: boolean;
	onChange: () => void;
	label: string;
	indeterminate?: boolean;
	className?: string;
	onClick?: (event: MouseEvent) => void;
}

/** Gray while unchecked, primary color only once it is checked. */
export default ({ checked, onChange, label, indeterminate = false, className = "", onClick }: Props): JSX.Element => (
	<input
		type="checkbox"
		className={`checkbox checkbox-sm ${checked || indeterminate ? "checkbox-primary" : "border-base-content/25 bg-base-100"} ${className}`}
		checked={checked}
		ref={input => {
			if (input) input.indeterminate = indeterminate;
		}}
		onClick={onClick}
		onChange={onChange}
		aria-label={label}
	/>
);
