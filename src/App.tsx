import React, { useState, useEffect } from "react";
import { FileSelector } from "./components/file-selector";
import "./App.css";

import { makeImage, drawImageCanvas } from "./converters/image";
import { drawPagesToCanvas } from "./converters/pdf";
import { downloadFile, getPublicResource, convertCanvasToBlob } from "./utils";
import { Footer } from "./components/footer";

const SUPPORTED_IMAGE_FORMATS = [
  { visual: "PNG", mime: "image/png", extension: "png" },
  { visual: "JPEG", mime: "image/jpeg", extension: "jpg" },
  { visual: "WEBP", mime: "image/webp", extension: "webp" },
];

function App() {
  const [file, setFile] = useState<Blob | null>(null);
  const [selectedFormat, setSelectedFormat] = useState(
    SUPPORTED_IMAGE_FORMATS[0],
  );
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  const tryConvert = async () => {
    if (!file) return;
    if (!canvasRef.current) return;

    const dataUrl = await convertCanvasToBlob(
      canvasRef.current,
      selectedFormat.mime,
    );

    downloadFile(dataUrl, `loconv-${Date.now()}.${selectedFormat.extension}`);
    setTimeout(() => URL.revokeObjectURL(dataUrl), 1000);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile || !canvasRef.current) return;

    setFile(selectedFile);

    if (SUPPORTED_IMAGE_FORMATS.some((f) => f.mime === selectedFile.type)) {
      try {
        const img = await makeImage(selectedFile);

        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        drawImageCanvas(img, selectedFormat.mime, canvasRef.current);
      } catch (err) {
        console.error("Failed to process image:", err);
      }
    } else if (selectedFile.type === "application/pdf") {
      const canvas = canvasRef.current;

      if (!canvas) return;

      try {
        await drawPagesToCanvas(selectedFile, canvas);
      } catch (err) {
        console.error("Failed to process PDF:", err);
      }
    }
  };

  // Load in placeholder image
  useEffect(() => {
    const drawPlaceholderImage = async () => {
      // This seems like a hack but I have no idea what else to do
      const imageData = await fetch(getPublicResource("/placeholder.png"));
      const placeholderImage = await makeImage(await imageData.blob());

      await drawImageCanvas(
        placeholderImage,
        SUPPORTED_IMAGE_FORMATS[0].mime, // Placeholder is a PNG
        canvasRef.current as HTMLCanvasElement,
      );
    };

    drawPlaceholderImage();
  }, []);

  return (
    <div className="app">
      <div className="container">
        <h1 className="text-center">loconv</h1>
        <p className="text-center">
          Small lightweight fully local image conversion
        </p>
        <div className="panel">
          <FileSelector
            accept="image/* application/pdf"
            handleFileChange={handleFileChange}
            className="btn btn-secondary"
          />
          <select
            onChange={(e) =>
              setSelectedFormat(
                SUPPORTED_IMAGE_FORMATS[parseInt(e.target.value, 10)],
              )
            }
            className="select-input"
          >
            {SUPPORTED_IMAGE_FORMATS.map((format, index) => (
              <option key={format.extension} value={index}>
                {format.visual}
              </option>
            ))}
          </select>
          <button
            onClick={tryConvert}
            type="button"
            className="btn btn-primary"
          >
            Convert
          </button>
        </div>
        <p>Image preview</p>
        <canvas ref={canvasRef} className="canvas"></canvas>
      </div>
      <Footer />
    </div>
  );
}

export default App;
