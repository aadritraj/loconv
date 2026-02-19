export const convertImageTo = (file: Blob, mime: string): Promise<string> => {
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
				const canvas = document.createElement("canvas");
				const ctx = canvas.getContext("2d");

				if (!ctx) {
					reject(new Error("Failed to create canvas context"));
					return;
				}

				canvas.width = img.width;
				canvas.height = img.height;

				if (mime === "image/jpeg") {
					ctx.fillStyle = "#FFFFFF";
					ctx.fillRect(0, 0, canvas.width, canvas.height);
				}

				ctx.drawImage(img, 0, 0);

				canvas.toBlob((blob) => {
					if (!blob) {
						reject(new Error("Blob creation failed"));
						return;
					}
					const url = URL.createObjectURL(blob);

					resolve(url);
				}, mime, 1);
			};

			img.onerror = () => reject(new Error("Image loading failed"));
		};

		fileReader.onerror = () => reject(new Error("File reading failed"));
		fileReader.readAsDataURL(file);
	});
};
