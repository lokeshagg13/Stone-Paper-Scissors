import { useContext, useEffect, useRef, useState } from "react";
import Webcam from "./Webcam";
import GameContext from "../store/gameContext";

function UserCard() {
  const gameContext = useContext(GameContext);
  const videoRef = useRef(null);
  const cardTitleRef = useRef(null);
  const [error, setError] = useState(null);
  const [webcamWidth, setWebcamWidth] = useState(0);
  const [webcamHeight, setWebcamHeight] = useState(0);
  const [webcamEnabled, setWebcamEnabled] = useState(false);

  useEffect(() => {
    // Check if webcam access is supported.
    const hasGetUserMedia = () => !!navigator.mediaDevices?.getUserMedia;
    if (!hasGetUserMedia()) {
      setError("User Media not supported");
    }
  }, []);

  useEffect(() => {
    if (webcamEnabled) {
      gameContext.setGameAsReady();
    } else {
      gameContext.interruptGame();
    }
    // eslint-disable-next-line
  }, [webcamEnabled]);

  useEffect(() => {
    const resizeWebcam = () => {
      if (gameContext.userCardRef.current) {
        const { offsetWidth, offsetHeight } = gameContext.userCardRef.current;
        setWebcamWidth(offsetWidth - 16);
        setWebcamHeight(offsetHeight - cardTitleRef.current.offsetHeight - 78);
        videoRef.current.stopWebcam();
        setWebcamEnabled(false);
      }
    };
    resizeWebcam();
    window.addEventListener("resize", () => resizeWebcam());
    return () => window.removeEventListener("resize", () => resizeWebcam());
    // eslint-disable-next-line
  }, []);

  const enableWebcam = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      videoRef.current.startWebcam(mediaStream);
      setWebcamEnabled(true);
    } catch (err) {
      console.error("Camera access denied or failed", err);
      setError("Camera access was denied or failed.");
    }
  };

  const disableWebcam = () => {
    videoRef.current.stopWebcam();
    setWebcamEnabled(false);
  };

  return (
    <div
      className={`card flex flex-col gap-8 ${
        webcamEnabled ? "card-adjust" : ""
      }`}
      ref={gameContext.userCardRef}
    >
      <div className="text-center card-title" ref={cardTitleRef}>
        User
      </div>
      <div className="flex flex-1 items-center justify-center my-2">
        {error ? (
          <p>{error}</p>
        ) : !webcamEnabled ? (
          <button className="btn-webcam" onClick={enableWebcam}>
            Enable Webcam
          </button>
        ) : (
          <button className="btn-webcam" onClick={disableWebcam}>
            Disable Webcam
          </button>
        )}
      </div>
      <div className={`${webcamEnabled ? "show" : "hide"}`}>
        <Webcam width={webcamWidth} height={webcamHeight} ref={videoRef} />
      </div>
    </div>
  );
}

export default UserCard;
