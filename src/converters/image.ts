export const makeImage = (file: Blob): Promise<HTMLImageElement> => {
	return new Promise((resolve, reject) => {
		const url = URL.createObjectURL(file);
		const img = new Image();

		img.onload = () => {
			URL.revokeObjectURL(url);
			resolve(img);
		};
		img.onerror = () => {
			URL.revokeObjectURL(url);
			reject(new Error("Image loading failed"));
		};

		img.src = url;
	});
};

export const drawImageCanvas = (
	img: HTMLImageElement,
	targetMime: string,
	canvas: HTMLCanvasElement,
): Promise<void> => {
	return new Promise((resolve, reject) => {
		const ctx = canvas.getContext("2d");
		if (!ctx) {
			reject(new Error("Failed to create canvas context"));
			return;
		}

		canvas.width = img.naturalWidth;
		canvas.height = img.naturalHeight;

		if (targetMime === "image/jpeg") {
			ctx.fillStyle = "#FFFFFF";
			ctx.fillRect(0, 0, canvas.width, canvas.height);
		}

		ctx.drawImage(img, 0, 0);
		resolve();
	});
};
