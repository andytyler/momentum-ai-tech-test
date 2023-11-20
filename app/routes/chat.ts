import express from "express";
import { getFilesInFolder } from "../server/reader";
import { doesHTMLContainDriftWidget } from "../server/processor";

const router = express.Router();

router.get("/drift", async (req, res) => {
	const drift = await getFilesInFolder(200, "../data").then((result) => {
		return result.map((item, index, array) => {
			return doesHTMLContainDriftWidget(item);
		});
	});

	res.send(drift);
});

export default router;
