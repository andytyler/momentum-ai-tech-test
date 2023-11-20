import { type HtmlWithFile, getFilesInFolder } from "./reader";

type DriftResponse = {
	companyName: string;
	hasDrift: boolean;
};

export function doesHTMLContainDriftWidget(item: HtmlWithFile): DriftResponse {
	const companyName: string = item.file.split(".")[0];

	const hasDrift: boolean = checkForString(item.html, "https://js.driftt.com/include/");

	return { companyName, hasDrift };
}

function checkForString(html: string, string: string): boolean {
	if (html?.includes(string)) {
		return true;
	}
	return false;
}

// function getStringTag(html: string, search_string: string) {
// 	const $ = cheerio.load(html);

// 	const elements = $(`*:contains(${search_string})`);

// 	let type_list: string[] = [];
// 	elements.each((index, element) => {
// 		type_list.push(element.type);
// 	});
// 	return type_list.length > 0;
// }

// function checkForScript(html: string) {
// 	const $ = cheerio.load(html);
// 	let drift_js = $("link");

// 	let list: boolean[] = [];
// 	drift_js.each((index, element) => {
// 		if ($(element).toString().includes("drift")) {
// 			list.push(true);
// 		}
// 	});

// 	return list.length > 0;
// }
