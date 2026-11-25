import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { addCollection } from "@iconify/react";

import offlineIcons from "virtual:offline-icons";

import 'react-tooltip/dist/react-tooltip.css'

import "@/styles/global.css";

import App from "@/App.tsx";
import NotFoundPage from "@/components/NotFound";

// Icons ship inside the bundle, so they also work on a LAN without internet.
addCollection(offlineIcons);

// The app lives at "/" (folders go in the #hash). Any other path is a 404.
const isAppPath = ["/", "/index.html"].includes(window.location.pathname);

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		{isAppPath ? <App /> : <NotFoundPage />}
	</StrictMode>
);
