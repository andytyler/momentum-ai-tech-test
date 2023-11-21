import { readFile, readdir } from "fs/promises";
import { basename, extname, join, parse } from "path";
import puppeteer from "puppeteer";
import * as cheerio from "cheerio";
import axios from "axios";

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

async function doitall() {
	const array = await constructUrlArray("../data");
	const driftResultArray = [];

	const browser = await puppeteer.launch({ headless: true });
	for (const url of array) {
		let successWithIFrame = false;
		let successWithScript = false;
		let successWithString = false;
		let successConfirmationWithIFrameTitle = false;
		const page = await browser.newPage();
		await page.setViewport({ width: 1200, height: 1080 });

		let containerHtml = "";
		await axios
			.get("http://" + url)
			.then((res) => {
				if (res.status === 200) {
					containerHtml = res.data;
				}
			})
			.catch(async (err) => {
				console.error(`Error navigating to "http://${url}" - Trying "http://www.${url}"`);
				await axios
					.get("http://www." + url)
					.then((res) => {
						if (res.status === 200) {
							containerHtml = res.data;
						}
					})
					.catch((err) => {
						console.error(`Error navigating to "http://www.${url}"`);
					});
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
		driftResultArray.push({ url, successWithIFrame, successConfirmationWithIFrameTitle, successWithString, successWithScript });
	}
	await browser.close();
	console.log(driftResultArray);
}

doitall();
// aprima
// doingud
// edmentum
