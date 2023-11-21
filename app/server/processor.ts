import { URL } from "url";
// import { type HtmlWithFile, getFilesInFolder } from "./reader";
import * as cheerio from "cheerio";
import { readFile, readdir } from "fs/promises";
import { extname, join } from "path";

export type HtmlWithFile = {
	html: string;
	file: string;
};

export type DriftResponse = {
	companyName: string;
	hasDrift: boolean;
};
export async function getFilesInFolder(take_until_index: number, relativePath: string): Promise<HtmlWithFile[]> {
	// const __filename = fileURLToPath(import.meta.url);
	const folder_path = join(__dirname, relativePath);

	const files = await readdir(folder_path);
	const html_file_array: HtmlWithFile[] = [];

	for (const [i, file] of files.entries()) {
		const filepath = join(folder_path, file);
		const extension = extname(filepath);
		if (extension === ".html") {
			const html: string = await readFile(filepath, "utf-8");
			html_file_array.push({ html, file });
		}
		if (take_until_index === i) {
			return html_file_array;
		}
	}

	return html_file_array;
}

// load pupeteer page
// check for iframe
// wait for iframe to load
// check for drift widget
// return true/false

let total_positive = 0;
let total_negative = 0;

function checkForString(html: string, string: string): boolean {
	if (html?.includes(string)) {
		return true;
	}
	return false;
}

export function doesHTMLContainDriftWidget(item: HtmlWithFile): DriftResponse {
	const companyName: string = item.file.split(".")[0];

	const hasDriftFromCDN: boolean = checkForString(item.html, "https://js.driftt.com/include/");
	if (hasDriftFromCDN) {
		total_positive++;
	} else {
		total_negative++;
	}

	console.log(companyName.padEnd(20), hasDriftFromCDN); //test.toString().padEnd(15)

	return { companyName, hasDrift: hasDriftFromCDN };
}

function constructUrlFromFileName(fileName: string): string {}

function loadPupeteer(url: string) {
	const $ = cheerio.load(html);
	const iframe = $("iframe");
	if (iframe.length > 0) {
		console.log("iframe found");
	}
}

getFilesInFolder(-1, "../data").then((result) => {
	result.map((item, index, array) => {
		doesHTMLContainDriftWidget(item);
	});
	console.log("total positive: ", total_positive);
	console.log("total negative: ", total_negative);
});
