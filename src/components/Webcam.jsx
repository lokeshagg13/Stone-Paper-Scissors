import {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useState,
  useContext,
} from "react";
import GameContext from "../store/gameContext";

const Webcam = forwardRef(({ width, height }, ref) => {
  const gameContext = useContext(GameContext);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const cameraRef = useRef(null);
  const handsRef = useRef(null);
  const [stream, setStream] = useState(null);
  
  // Expose enable/disable methods to parent
  useImperativeHandle(ref, () => ({
    startWebcam: (mediaStream) => {
      if (cameraRef.current) {
        cameraRef.current.start();
      }
      setStream(mediaStream);
    },
    stopWebcam: () => {
      if (cameraRef.current) {
        cameraRef.current.stop();
      }
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
    },
  }));

  useEffect(() => {
    const onResults = (results) => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

      if (results.multiHandLandmarks) {
        let finalLandmarks = null;
        for (const landmarks of results.multiHandLandmarks) {
          window.drawConnectors(ctx, landmarks, window.HAND_CONNECTIONS, {
            color: "#00FF00",
            lineWidth: 5,
          });
          window.drawLandmarks(ctx, landmarks, {
            color: "#FF0000",
            lineWidth: 2,
          });
          finalLandmarks = landmarks;
        }
        gameContext.updateHandLandmarks(finalLandmarks);
      }
      ctx.restore();
    };

    canvasRef.current.width = width;
    canvasRef.current.height = height;

    const hands = new window.Hands({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });
    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.5,
    });
    hands.onResults(onResults);
    handsRef.current = hands;

    if (videoRef.current) {
      cameraRef.current = new window.Camera(videoRef.current, {
        onFrame: async () => {
          await hands.send({ image: videoRef.current });
        },
        width,
        height,
      });
    }

    // Cleanup on unmount
    return () => {
      if (cameraRef.current) {
        cameraRef.current.stop();
      }
    };
  // eslint-disable-next-line
  }, [width, height]);

  return (
    <>
      <video className="input-video hide" ref={videoRef}></video>
      <canvas
        className="output-canvas"
        width={width}
        height={height}
        ref={canvasRef}
      ></canvas>
    </>
  );
});

export default Webcam;
