import { readFile, readdir } from "fs/promises";
import { basename, extname, join, parse } from "path";
import puppeteer from "puppeteer";
import * as cheerio from "cheerio";
import { type DriftResponse } from "./processor";

async function constructUrlArray(relativePath: string) {
	// const __filename = fileURLToPath(import.meta.url);
	const folder_path = join(__dirname, relativePath);

	const files = await readdir(folder_path);
	const html_file_array = [];

	for (const [i, file] of files.entries()) {
		const filepath = join(folder_path, file);

		// const extension = extname(filepath);
		const { name } = parse(filepath);
		const base_name = name;

		let url;
		if (base_name.split(".").length === 1) {
			url = base_name + ".com";
		} else {
			url = base_name;
		}
		html_file_array.push(url);
	}

	return html_file_array;
}

function checkForString(html: string, string: string): boolean {
	if (html?.includes(string)) {
		return true;
	}
	return false;
}

export async function doitall(headless: boolean = true): Promise<DriftResponse[]> {
	const array = await constructUrlArray("../data");
	const driftResultArray = [];

	const browser = await puppeteer.launch({ headless });
	for (const url of array) {
		let successWithIFrame = false;
		let successWithScript = false;
		let successWithString = false;
		let successConfirmationWithIFrameTitle = false;
		const page = await browser.newPage();
		await page.setViewport({ width: 1200, height: 1080 });

		await page.goto("http://" + url).catch(async (err) => {
			console.error(`Error navigating to "http://${url}" - Trying "http://www.${url}"`);
			// console.log(err);
			await page.goto("http://www." + url).catch((err) => {
				console.error(`Error navigating to "http://www.${url}"`);
				// console.log(err);
			});
		});

		try {
			await page.waitForNetworkIdle({ idleTime: 3000 });
		} catch (error) {
			console.error("Network idle timeout:", page.url());
		}

		await page.evaluate(() => {
			window.scrollTo(0, 3000);
		});

		const containerHtml = await page.evaluate(() => {
			return document.documentElement.outerHTML;
		});

		const $ = cheerio.load(containerHtml);
		const iframeCollection = $("iframe")
			.toArray()
			.map((element) => {
				return { src: $(element).attr("src"), title: $(element).attr("title") };
			});

		iframeCollection.forEach((iframe) => {
			if (iframe.title?.toLowerCase().includes("drift")) {
				successConfirmationWithIFrameTitle = true;
			}
			if (iframe.src?.toLowerCase().includes("drift")) {
				successWithIFrame = true;
			}
		});

		const scriptCollection = $("script")
			.toArray()
			.map((element) => {
				return $(element).attr("src");
			})
			.filter((item) => item?.includes("drift"));

		if (scriptCollection.length > 0) {
			successWithScript = true;
		}

		const hasDriftFromCDN: boolean = checkForString(containerHtml, "https://js.driftt.com/include/");
		if (hasDriftFromCDN) {
			successWithString = true;
		}

		await page.close();
		console.log(url.padEnd(25), successWithIFrame, successConfirmationWithIFrameTitle, successWithString, successWithScript);
		let decision = false;
		if (successWithIFrame || successConfirmationWithIFrameTitle || successWithString || successWithScript) {
			decision = true;
		}
		driftResultArray.push({ company: url, hasDrift: decision });
	}
	await browser.close();
	console.log(driftResultArray);
	return driftResultArray;
}

// doitall();
// aprima
// doingud
// edmentum
