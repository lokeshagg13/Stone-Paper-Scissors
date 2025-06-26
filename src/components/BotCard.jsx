import { useContext } from "react";

import gameConfig from "../logic/config";
import GameContext from "../store/gameContext";
import StoneImage from "../images/stone.png";
import PaperImage from "../images/paper.png";
import ScissorsImage from "../images/scissors.png";
import WonImage from "../images/won.png";
import LostImage from "../images/lost.png";
import DrawImage from "../images/draw.png";
import BotName from "./names/BotName";

const { STONE, PAPER, SCISSORS } = gameConfig.CHOICE;
const { READY, STARTED, COMPLETED } = gameConfig.GAME_STATUS;
const { USER, BOT } = gameConfig.WINNER;

function BotCard() {
  const gameContext = useContext(GameContext);

  const getBotChoiceImage = () => {
    switch (gameContext.botChoice) {
      case STONE:
        return StoneImage;
      case PAPER:
        return PaperImage;
      case SCISSORS:
        return ScissorsImage;
      default:
        return null;
    }
  };

  const getBotWinStatus = () => {
    switch (gameContext.gameWinner) {
      case BOT:
        return WonImage;
      case USER:
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
          <p className="text-black px-4 text-center">
            Please press ENABLE WEBCAM for starting the game
          </p>
        ) : gameContext.gameStatus === READY ? (
          <></>
        ) : gameContext.gameStatus === STARTED ? (
          gameContext.botChoice && (
            <img
              key={gameContext.botRoundChoice}
              src={getBotChoiceImage()}
              alt={gameContext.botChoice}
              className="pop-animation max-h-full max-w-full"
            />
          )
        ) : (
          gameContext.gameStatus === COMPLETED &&
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
