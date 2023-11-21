import express from "express";
import { doesHTMLContainDriftWidget } from "../server/processor";
import { determineDriftOnAllSites } from "../server/pupeteer";

const router = express.Router();

router.post("/drift", async (req, res) => {
	const drift = await determineDriftOnAllSites(true);

	res.send(drift);
});

export default router;
