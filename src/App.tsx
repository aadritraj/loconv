import React, { useState } from "react";
import { FileSelector } from "./components/file-selector";
import "./App.css";

import { drawImageCanvas, convertCanvasToBlob } from "./converters/image";
import { downloadFile } from "./utils";

const SUPPORTED_FORMATS = [
	{ visual: "PNG", mime: "image/png", extension: "png" },
	{ visual: "JPEG", mime: "image/jpeg", extension: "jpg" },
	{ visual: "WEBP", mime: "image/webp", extension: "webp" },
];

function App() {
	const [file, setFile] = useState<Blob | null>(null);
	const [selectedFormat, setSelectedFormat] = useState(SUPPORTED_FORMATS[0]);
	const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

	const tryConvert = async () => {
		if (!file) return;
		if (!canvasRef.current) return;

		await drawImageCanvas(file, selectedFormat.mime, canvasRef.current);
		const dataUrl = await convertCanvasToBlob(canvasRef.current, selectedFormat.mime);

		downloadFile(dataUrl, `loconv-${Date.now()}.${selectedFormat.extension}`);
		setTimeout(() => URL.revokeObjectURL(dataUrl), 1000);
	};

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFile = e.target.files?.[0];

		if (!selectedFile) return;
		setFile(selectedFile);

		if (!canvasRef.current) return;
		await drawImageCanvas(selectedFile, selectedFormat.mime, canvasRef.current);
	}

	return (
		<div>
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
			<canvas ref={canvasRef}></canvas>
		</div>
	);
}

export default App;
