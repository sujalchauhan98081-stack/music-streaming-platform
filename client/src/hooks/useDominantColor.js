import { useState, useEffect } from "react";

export const useDominantColor = (imageUrl) => {
  const [color, setColor] = useState({ r: 24, g: 24, b: 24 }); // fallback: matches our surface color

  useEffect(() => {
    if (!imageUrl) {
      setColor({ r: 24, g: 24, b: 24 });
      return;
    }

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imageUrl;

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 10;
        canvas.height = 10;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, 10, 10);

        const { data } = ctx.getImageData(0, 0, 10, 10);
        let r = 0, g = 0, b = 0;
        const pixelCount = data.length / 4;

        for (let i = 0; i < data.length; i += 4) {
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
        }

        r = Math.floor(r / pixelCount);
        g = Math.floor(g / pixelCount);
        b = Math.floor(b / pixelCount);

        setColor({ r, g, b });
      } catch (err) {
        setColor({ r: 24, g: 24, b: 24 });
      }
    };

    img.onerror = () => setColor({ r: 24, g: 24, b: 24 });
  }, [imageUrl]);

  return color;
};