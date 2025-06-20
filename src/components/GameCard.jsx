import { useEffect, useContext, useRef } from "react";
import GameContext from "../store/gameContext";

import SPSAudio from "../audio/SPS.mp3";
import constants from "../store/constants";

function GameCard() {
  const gameContext = useContext(GameContext);
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio(SPSAudio);
    return () => {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (
      gameContext.gameStatus === "ready" ||
      gameContext.gameStatus === "started"
    ) {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [gameContext.gameStatus]);

  useEffect(() => {
    if (
      gameContext.roundStatus === "completed" &&
      gameContext.gameRound >= constants.MAX_ROUNDS
    ) {
      gameContext.endGame();
    }
    // eslint-disable-next-line
  }, [gameContext.netRound, gameContext.gameRound, gameContext.roundStatus]);

  useEffect(() => {
    if (gameContext.summaryBoxRef.current) {
      gameContext.summaryBoxRef.current.scrollTop =
        gameContext.summaryBoxRef.current.scrollHeight;
    }
  }, [gameContext.summary, gameContext.summaryBoxRef]);

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
    // eslint-disable-next-line
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
    // eslint-disable-next-line
  }, [gameContext.botRoundChoice, gameContext.userRoundChoice]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      event.preventDefault();
      if (
        (gameContext.gameStatus === "ready" ||
          gameContext.gameStatus === "completed") &&
        event.key === "Enter"
      ) {
        gameContext.startGame();
      }
      if (
        gameContext.gameStatus === "started" &&
        ["invalid", "completed"].includes(gameContext.roundStatus) &&
        event.key === " "
      ) {
        gameContext.startRound();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line
  }, [gameContext.gameStatus, gameContext.roundStatus]);

  return (
    <div className="card flex flex-col gap-2r" ref={gameContext.gameCardRef}>
      {/* Game Status and Button Section */}
      <div className="flex justify-center my-4">
        {gameContext.gameStatus === "ready" ? (
          <button
            onClick={gameContext.startGame}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg cursor-pointer hover:bg-blue-700 transition duration-300 text-lg font-medium shadow-md"
          >
            Start Game
          </button>
        ) : gameContext.gameStatus === "started" ? (
          gameContext.roundStatus === "invalid" ? (
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
            <button className="text-white px-6 py-3 rounded-lg text-lg font-medium shadow-md disabled-btn">
              Round Ongoing
            </button>
          )
        ) : gameContext.gameStatus === "completed" ? (
          <button
            onClick={gameContext.restartGame}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg cursor-pointer hover:bg-blue-700 transition duration-300 text-lg font-medium shadow-md"
          >
            Restart Game
          </button>
        ) : (
          <></>
        )}
      </div>

      {/* Round Info Section */}
      {(gameContext.gameStatus === "started" ||
        gameContext.gameStatus === "completed") && (
        <div className="flex flex-col gap-1r justify-between items-center text-xl font-semibold bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center">
            <strong className="text-blue-600">
              Round {Math.min(gameContext.gameRound, constants.MAX_ROUNDS)}
            </strong>
          </div>
          <div className="flex items-center justify-between gap-5 w-full">
            <div className="flex flex-col items-center text-green-600">
              <div>
                <strong>{gameContext.botName}</strong>
              </div>
              <div>{gameContext.botScore}</div>
            </div>
            <div className="flex flex-col items-center text-purple-600">
              <div>
                <strong>{gameContext.userName}</strong>
              </div>
              <div>{gameContext.userScore}</div>
            </div>
          </div>
        </div>
      )}

      {/* Summary Section */}
      <div className="flex flex-col p-4 rounded-lg shadow-md flex-1">
        <label
          htmlFor="summary"
          className="text-xl font-medium mb-2 text-gray-800"
        >
          Summary
        </label>

        <div
          id="summary"
          className="border rounded-lg p-4 w-full text-lg flex-1 overflow-y-auto"
          ref={gameContext.summaryBoxRef}
        >
          {gameContext.summary}
        </div>
      </div>
    </div>
  );
}

export default GameCard;
