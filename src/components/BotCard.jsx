import { useContext } from "react";

import GameContext from "../store/gameContext";
import StoneImage from "../images/stone.png";
import PaperImage from "../images/paper.png";
import ScissorsImage from "../images/scissors.png";

function BotCard() {
  const gameContext = useContext(GameContext);

  const getImage = () => {
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

  return (
    <div className="card flex flex-col gap-8" ref={gameContext.botCardRef}>
      <div className="text-center card-title">Bot</div>
      <div className="flex flex-1 items-center justify-center my-2">
        {gameContext.gameStatus === null ? (
          <p>Please press ENABLE WEBCAM for starting the game</p>
        ) : gameContext.gameStatus === "ready" ? (
          <></>
        ) : gameContext.gameStatus === "started" ? (
          gameContext.botChoice && (
            <img
              key={gameContext.botRoundChoice}
              src={getImage()}
              alt={gameContext.botChoice}
              className="pop-animation max-h-full max-w-full"
            />
          )
        ) : (
          <p>Someone won!</p>
        )}
      </div>
    </div>
  );
}

export default BotCard;
