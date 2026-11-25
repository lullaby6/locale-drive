import { useEffect, useRef, useState } from "react";

/** Becomes true once the element scrolls near the viewport, so heavy thumbnails load lazily. */
export default function useInView<T extends Element>(rootMargin = "200px") {
	const ref = useRef<T>(null);
	const [inView, setInView] = useState(false);

	useEffect(() => {
		const element = ref.current;
		if (!element || inView) return;

		if (!("IntersectionObserver" in window)) {
			setInView(true);
			return;
		}

		const observer = new IntersectionObserver(
			entries => {
				if (entries.some(entry => entry.isIntersecting)) {
					setInView(true);
					observer.disconnect();
				}
			},
			{ rootMargin },
		);

		observer.observe(element);

		return () => observer.disconnect();
	}, [inView, rootMargin]);

	return [ref, inView] as const;
}
