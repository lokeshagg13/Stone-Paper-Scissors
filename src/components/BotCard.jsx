import { useContext } from "react";

import GameContext from "../store/gameContext";
import StoneImage from "../images/stone.png";
import PaperImage from "../images/paper.png";
import ScissorsImage from "../images/scissors.png";
import WonImage from "../images/won.png";
import LostImage from "../images/lost.png";
import DrawImage from "../images/draw.png";
import BotName from "./names/BotName";

function BotCard() {
  const gameContext = useContext(GameContext);

  const getBotChoiceImage = () => {
    switch (gameContext.botChoice) {
      case "stone":
        return StoneImage;
      case "paper":
        return PaperImage;
      case "scissors":
        return ScissorsImage;
      default:
        return null;
    }
  };

  const getBotWinStatus = () => {
    switch (gameContext.gameWinner) {
      case "bot":
        return WonImage;
      case "user":
        return LostImage;
      default:
        return DrawImage;
    }
  };

  return (
    <div className="card flex flex-col gap-8" ref={gameContext.botCardRef}>
      <BotName />
      <div className="flex flex-1 items-center justify-center my-2">
        {gameContext.gameStatus === null ? (
          <p>Please press ENABLE WEBCAM for starting the game</p>
        ) : gameContext.gameStatus === "ready" ? (
          <></>
        ) : gameContext.gameStatus === "started" ? (
          gameContext.botChoice && (
            <img
              key={gameContext.botRoundChoice}
              src={getBotChoiceImage()}
              alt={gameContext.botChoice}
              className="pop-animation max-h-full max-w-full"
            />
          )
        ) : (
          gameContext.gameStatus === "completed" &&
          gameContext.gameWinner && (
            <img
              key={gameContext.gameWinner}
              src={getBotWinStatus()}
              alt={gameContext.gameWinner}
              className="pop-animation max-h-full max-w-full"
            />
          )
        )}
      </div>
    </div>
  );
}

export default BotCard;
