import { useRef } from "react";

export function FileSelector({ accept, handleFileChange }: { accept: string, handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => any;}) {
	const fileInputRef = useRef<HTMLInputElement>(null);

	const spawnSelector = () => {
		fileInputRef.current?.click();
	};

	return (
		<div>
			<input
				type="file"
				ref={fileInputRef}
				accept={accept}
				className="hidden"
				onChange={handleFileChange}
			/>
			<button onClick={spawnSelector}>Select File</button>
		</div>
	);
}
