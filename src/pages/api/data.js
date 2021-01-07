import { getData } from "../../lib/api";

export default async function handler(req, res) {
	try {
		console.log("API: Fetching data...");
		const data = await getData();
		console.log("API: Fetching complete.");
		return res.status(200).json({ data });
	} catch (err) {
		console.log(err);
		return res.status(400).json({ err, data: { overview: {}, items: [] } });
	}
}
