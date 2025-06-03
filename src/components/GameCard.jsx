import { useEffect, useContext, useRef } from "react";
import GameContext from "../store/gameContext";

import SPSAudio from "../audio/SPS.mp3";

function GameCard() {
  const gameContext = useContext(GameContext);
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio(SPSAudio);
    return () => {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    };
  }, []);

  useEffect(() => {
    if (gameContext.roundStatus !== "started") {
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }

    const chooseTimeout = setTimeout(() => {
      gameContext.makeBotChoice();
      gameContext.detectUserChoice();
    }, 2500); // Choose after 2.5 seconds

    return () => {
      clearTimeout(chooseTimeout);
    };
  }, [gameContext.roundStatus]);

  useEffect(() => {
    if (
      gameContext.botRoundChoice === null ||
      gameContext.userRoundChoice === null
    ) {
      return;
    }
    gameContext.updateScores();

    return () => {};
  }, [gameContext.botRoundChoice, gameContext.userRoundChoice]);

  return (
    <div className="card flex flex-col gap-2r" ref={gameContext.gameCardRef}>
      {/* Game Status and Button Section */}
      <div className="flex justify-center my-4">
        {gameContext.gameStatus === "ready" && (
          <button
            onClick={gameContext.startGame}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg cursor-pointer hover:bg-blue-700 transition duration-300 text-lg font-medium shadow-md"
          >
            Start Game
          </button>
        )}
        {gameContext.gameStatus === "started" &&
          (gameContext.roundStatus === "invalid" ? (
            <button
              onClick={gameContext.startRound}
              className="bg-red-500 text-white px-6 py-3 rounded-lg cursor-pointer hover:bg-red-600 transition duration-300 text-lg font-medium shadow-md"
            >
              Try Again
            </button>
          ) : gameContext.roundStatus === "completed" ? (
            <button
              onClick={gameContext.startRound}
              className="bg-green-500 text-white px-6 py-3 rounded-lg cursor-pointer hover:bg-green-600 transition duration-300 text-lg font-medium shadow-md"
            >
              Next Round
            </button>
          ) : (
            <></>
          ))}
      </div>

      {/* Round Info Section */}
      <div className="flex flex-col gap-1r justify-between items-center text-xl font-semibold bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center">
          <strong className="text-blue-600">
            Round {gameContext.gameRound}
          </strong>
        </div>
        <div className="flex items-center justify-between gap-5 w-full">
          <div className="flex flex-col items-center text-green-600">
            <div>
              <strong>Bot</strong>
            </div>
            <div>{gameContext.botScore}</div>
          </div>
          <div className="flex flex-col items-center text-purple-600">
            <div>
              <strong>User</strong>
            </div>
            <div>{gameContext.userScore}</div>
          </div>
        </div>
      </div>

      {/* Summary Section */}
      <div className="flex flex-col p-4 rounded-lg shadow-md flex-1">
        <label
          htmlFor="summary"
          className="text-xl font-medium mb-2 text-gray-800"
        >
          Summary
        </label>
        <textarea
          id="summary"
          rows="8"
          value={gameContext.summary}
          readOnly
          className="border rounded-lg p-4 w-full resize-none bg-gray-100 text-gray-800 shadow-inner text-lg flex-1"
        />
      </div>
    </div>
  );
}

export default GameCard;
