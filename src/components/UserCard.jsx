import { useContext, useEffect, useRef, useState } from "react";

import Webcam from "./Webcam";
import GameContext from "../store/gameContext";
import UserName from "./names/UserName";

function UserCard() {
  const gameContext = useContext(GameContext);
  const videoRef = useRef(null);
  const cardTitleRef = useRef(null);
  const [error, setError] = useState(null);
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
    <div className="card flex flex-col gap-8">
      <UserName ref={cardTitleRef} />

      {/* Enable/Disable Webcam Section */}
      <div
        className={`flex items-center justify-center my-2 ${
          !webcamEnabled ? "flex-1" : ""
        }`}
      >
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

      {/* Webcam Display Section */}
      <div className={`flex-1 ${webcamEnabled ? "show" : "hide"}`}>
        <Webcam ref={videoRef} />
      </div>
    </div>
  );
}

export default UserCard;
