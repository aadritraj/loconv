export const drawImageCanvas = (file: Blob, targetMime: string, canvas: HTMLCanvasElement): Promise<void> => {
	return new Promise((resolve, reject) => {
		const fileReader = new FileReader();

		fileReader.onload = (e) => {
			if (!e.target || typeof e.target.result !== "string") {
				reject(new Error("Invalid file reader event"));
				return;
			}

			const img = new Image();
			img.src = e.target.result;

			img.onload = () => {
				const ctx = canvas.getContext("2d");

				if (!ctx) {
					reject(new Error("Failed to create canvas context"));
					return;
				}

				canvas.width = img.width;
				canvas.height = img.height;

				if (targetMime === "image/jpeg") {
					ctx.fillStyle = "#FFFFFF";
					ctx.fillRect(0, 0, canvas.width, canvas.height);
				}

				ctx.drawImage(img, 0, 0);
				resolve();
			};

			img.onerror = () => reject(new Error("Image loading failed"));
		};

		fileReader.onerror = () => reject(new Error("File reading failed"));
		fileReader.readAsDataURL(file);
	});
}

export const convertCanvasToBlob = (canvas: HTMLCanvasElement, targetMime: string): Promise<string> => {
	return new Promise((resolve, reject) => {
		canvas.toBlob((blob) => {
			if (!blob) {
				reject(new Error("Blob creation failed"));;
				return;
			}

			resolve(URL.createObjectURL(blob))
		}, targetMime, 1)
	})
}
