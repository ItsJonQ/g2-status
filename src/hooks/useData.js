import React from "react";
import axios from "axios";
import { createStore } from "@wp-g2/substate";

const API_URL = "/api/data/";

const initialState = Object.freeze({
	items: [],
	overview: {
		statusRaw: 0,
	},
	groupedItems: {
		substate: [],
		utils: [],
		"create-styles": [],
		styles: [],
		context: [],
		components: [],
	},
});

export const dataStore = createStore((set, get) => ({
	// State
	...initialState,
	didInitialize: false,
	didLoad: false,
	fetching: false,
	visible: "hidden",

	// Setters
	setData: (next) => set({ ...next }),
	setFetching: (next) => set({ fetching: next }),
	setVisible: (next) => set({ visible: next }),
	setInitialData: (next) => {
		if (!get().didInitialize) {
			set({ ...next, didInitialize: true });
		}
	},

	// Actions
	fetchData: () => {
		const { setFetching, setData } = get();

		console.log("Fetching...");
		setFetching(true);

		axios
			.get(API_URL)
			.then((response) => {
				console.log("Fetching completed.");
				setData(response?.data?.data);
				setFetching(false);
			})
			.catch((err) => {
				console.log(err);
				setFetching(false);
			});
	},
}));

export const useDataStore = dataStore;

function useVisibilityRefresh() {
	const { fetchData, visible, setVisible } = useDataStore();
	const refresh = visible === "visible";

	React.useEffect(() => {
		const handleVisibilityChange = () => setVisible(document.visibilityState);
		window.addEventListener("visibilitychange", handleVisibilityChange);
		return () => {
			window.removeEventListener("visibilitychange", handleVisibilityChange);
		};
	});

	React.useEffect(() => {
		if (refresh) {
			fetchData();
		}
	}, [refresh]);
}

function useDataSync() {
	const { fetchData } = useDataStore();
	const timerRef = React.useRef();

	React.useEffect(() => {
		fetchData();
	}, []);

	React.useEffect(() => {
		if (timerRef.current) {
			clearInterval(timerRef.current);
		}

		// Refresh every minute.
		timerRef.current = setInterval(fetchData, 60000);

		return () => {
			if (timerRef.current) {
				clearInterval(timerRef.current);
			}
		};
	});
}

function useLoad() {
	const timerRef = React.useRef();

	React.useEffect(() => {
		if (timerRef.current) {
			clearTimeout(timerRef.current);
		}

		timerRef.current = setTimeout(() => {
			dataStore.setState({ didLoad: true });
		}, 1000);

		return () => {
			if (timerRef.current) {
				clearTimeout(timerRef.current);
			}
		};
	}, []);
}

export function useData() {
	const { items, overview, fetching, groupedItems } = useDataStore();

	useLoad();
	useVisibilityRefresh();
	useDataSync();

	return { items, overview, fetching, groupedItems };
}
