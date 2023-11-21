import express from "express";
import { doesHTMLContainDriftWidget } from "../server/processor";
import { doitall } from "../server/pupeteer";

const router = express.Router();

router.get("/drift", async (req, res) => {
	const drift = await doitall(true);

	res.send(drift);
});

export default router;
