import { readFile, readdir } from "fs/promises";
import { extname, join } from "path";

export type HtmlWithFile = {
	html: string;
	file: string;
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

// getFilesInFolder(4, "../data").then((result) => {
// 	result.forEach((html) => {
// 		console.log(html.length);
// 	});
// });
