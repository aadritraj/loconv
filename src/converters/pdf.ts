import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.mjs?url";
import type { RenderParameters } from "pdfjs-dist/types/src/display/api";

GlobalWorkerOptions.workerSrc = pdfjsWorker;

export const drawPagesToCanvas = async (
	pdf: Blob,
	canvas: HTMLCanvasElement,
) => {
	const url = URL.createObjectURL(pdf);

	try {
		const doc = await getDocument(url).promise;
		const ctx = canvas.getContext("2d");
		if (!ctx) throw new Error("Failed to create canvas context");

		const pageData = [];
		let totalHeight = 0;
		let maxWidth = 0;

		for (let i = 1; i <= doc.numPages; i++) {
			const page = await doc.getPage(i);
			const viewport = page.getViewport({ scale: 1 });
			pageData.push({ page, viewport });
			totalHeight += viewport.height;
			maxWidth = Math.max(maxWidth, viewport.width);
		}

		canvas.width = maxWidth;
		canvas.height = totalHeight;

		// temporary canvas as doing it normally redraws the entire canvas
		// this should be GCed
		const tempCanvas = document.createElement("canvas");
		const tempCtx = tempCanvas.getContext("2d");
		if (!tempCtx) throw new Error("Failed to create temp context");

		let currentY = 0;

		for (const { page, viewport } of pageData) {
			tempCanvas.width = viewport.width;
			tempCanvas.height = viewport.height;

			const renderContext: RenderParameters = {
				canvas: tempCanvas,
				canvasContext: tempCtx,
				viewport: viewport,
			};

			await page.render(renderContext).promise;

			ctx.drawImage(tempCanvas, 0, currentY);

			currentY += viewport.height;
		}
	} catch (error) {
		console.error("PDF rendering failed:", error);
		throw error;
	} finally {
		URL.revokeObjectURL(url);
	}
};
