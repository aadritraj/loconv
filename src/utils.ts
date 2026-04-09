export const getPublicResource = (path: string) => {
	const base = import.meta.env.BASE_URL;
	const normalizedPath = path.startsWith("/") ? path.slice(1) : path;

	return `${base}${normalizedPath}`;
};

export const downloadFile = (url: string, fileName: string) => {
	const link = document.createElement("a");
	link.href = url;
	link.download = fileName;

	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
};
