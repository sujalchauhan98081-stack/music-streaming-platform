import { useRef, useEffect } from "react";

// Consumes an ALREADY-CREATED analyser node (owned by PlayerContext) and
// draws a live bar visualization. Does NOT create any Web Audio objects itself —
// that must happen exactly once, at the app level, not per-mount.
const AudioVisualizer = ({ analyserNode, isPlaying }) => {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    if (!analyserNode) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const bufferLength = analyserNode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw);
      analyserNode.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height;
        ctx.fillStyle = "#1db954";
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      }
    };

    if (isPlaying) {
      draw();
    } else {
      cancelAnimationFrame(animationFrameRef.current);
    }

    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [analyserNode, isPlaying]);

  return <canvas ref={canvasRef} width={200} height={40} className="opacity-80" />;
};

export default AudioVisualizer;