import { google } from "googleapis";
import initialData from "@data/initial";
import { getOverview, getItems, getGroupedItems } from "@selectors/data";

export async function getData() {
	if (process.env.USE_INITIAL_DATA_ONLY) {
		return {
			overview: getOverview(initialData.overview),
			items: getItems(initialData.data),
			groupedItems: getGroupedItems(getItems(initialData.data)),
		};
	}

	let fetchedData = initialData;

	try {
		const scopes = ["https://www.googleapis.com/auth/spreadsheets.readonly"];
		const jwt = new google.auth.JWT(
			process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
			null,
			// we need to replace the escaped newline characters
			// https://stackoverflow.com/questions/50299329/node-js-firebase-service-account-private-key-wont-parse
			process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, "\n"),
			scopes
		);

		const sheets = google.sheets({ version: "v4", auth: jwt });

		const progressData = await sheets.spreadsheets.values.get({
			spreadsheetId: process.env.SPREADSHEET_ID,
			range: "Component Integration Progress",
		});

		const overviewData = await sheets.spreadsheets.values.get({
			spreadsheetId: process.env.SPREADSHEET_ID,
			range: "Component Integration Progress Overview",
		});

		const overview = overviewData?.data?.values || [];
		const data = progressData?.data?.values || [];

		fetchedData = { overview, data };
	} catch (err) {
		console.log(err);
	}

	return {
		overview: getOverview(fetchedData.overview),
		items: getItems(fetchedData.data),
		groupedItems: getGroupedItems(getItems(fetchedData.data)),
	};
}
