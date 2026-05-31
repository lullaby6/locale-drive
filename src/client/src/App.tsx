import { useEffect, useRef } from "react";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Header from "@/components/Header";
import Toolbar from "@/components/Toolbar";
import Table from "@/components/Table";

import useGlobalStore from "@/store/global";

const AUTO_RELOAD_INTERVAL = 5000;

export default () => {
	const loading = useGlobalStore(state => state.loading);
	const fetchFiles = useGlobalStore(state => state.fetchFiles);
	const silentRefresh = useGlobalStore(state => state.silentRefresh);

	const fetched = useRef(false);

	useEffect(() => {
		if (fetched.current) return;
		fetched.current = true;

		fetchFiles();
	}, [fetchFiles]);

	useEffect(() => {
		const interval = setInterval(silentRefresh, AUTO_RELOAD_INTERVAL);

		return () => clearInterval(interval);
	}, [silentRefresh]);

	return (
		<main className="flex flex-col gap-5 p-6 lg:p-10">
			{loading && (
				<div className="fixed inset-0 z-50 flex justify-center items-center bg-black/50">
					<span className="loading loading-spinner loading-lg text-primary"></span>
				</div>
			)}

			<Header />
			<Toolbar />
			<Table />

			<ToastContainer
				position="bottom-right"
				autoClose={3000}
				pauseOnHover
				closeOnClick
				theme="colored"
			/>
		</main>
	);
};
