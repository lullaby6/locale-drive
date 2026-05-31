import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import 'react-tooltip/dist/react-tooltip.css'

import "@/styles/global.css";

import App from "@/App.tsx";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<App />
	</StrictMode>
);
