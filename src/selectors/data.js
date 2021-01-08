import _ from "lodash";
import { percentage } from "@lib/utils";

export function getOverview(initialData = []) {
	const stats = initialData[2] || [];
	const [totalTasks, currentStore, status] = stats;
	const statusRaw = Number(parseFloat(status)) / 100;
	const statusRawPct = statusRaw / 100;

	return {
		totalTasks: Number(totalTasks),
		currentStore: Number(currentStore),
		status,
		statusRaw,
		statusRawPct,
	};
}

export function getItems(initialData = []) {
	const filteredData = initialData.filter((entry) => entry.length);

	// Remove the headings
	filteredData.shift();

	const enhancedData = filteredData.map((entry) => {
		let [
			packageName,
			moduleName,
			status,
			progress,
			score,
			description,
			link,
		] = entry;

		if (packageName === "components" && !description) {
			description = `${moduleName} component.`;
		}

		score = Number(score);
		const progressValue = (score / 2) * 100;
		const progressPct = percentage(progressValue);

		return {
			packageName,
			moduleName,
			status,
			progress,
			progressValue,
			progressPct,
			score,
			description,
			link: link || "",
		};
	});

	return enhancedData;
}

export function getGroupedItems(initialData = []) {
	return _.groupBy(initialData, "packageName");
}
