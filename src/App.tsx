import React, { useState } from "react";
import { FileSelector } from "./components/file-selector";
import "./App.css";

import { convertImageTo } from "./converters/image";
import { downloadFile } from "./utils";

const SUPPORTED_FORMATS = [
	{ visual: "PNG", mime: "image/png", extension: "png" },
	{ visual: "JPEG", mime: "image/jpeg", extension: "jpg" },
	{ visual: "WEBP", mime: "image/webp", extension: "webp" },
];

function App() {
	const [file, setFile] = useState<Blob | null>(null);
	const [selectedFormat, setSelectedFormat] = useState(SUPPORTED_FORMATS[0]);

	const tryConvert = async () => {
		if (!file) return;
		const url = await convertImageTo(file, selectedFormat.mime);

		downloadFile(url, `loconv-${Date.now()}.${selectedFormat.extension}`);
		setTimeout(() => URL.revokeObjectURL(url), 1000);
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFile = e.target.files?.[0];

		if (selectedFile) {
			setFile(selectedFile);
		}
	}

	return (
		<div>
			<FileSelector
				accept="image/*"
				handleFileChange={handleFileChange}
			/>
			<select
				onChange={(e) =>
					setSelectedFormat(SUPPORTED_FORMATS[parseInt(e.target.value)])
				}
			>
				{SUPPORTED_FORMATS.map((format, index) => (
					<option key={format.extension} value={index}>
						{format.visual}
					</option>
				))}
			</select>
			<button onClick={tryConvert}>Convert</button>
		</div>
	);
}

export default App;
