import { useContext, useEffect } from "react";

import gameConfig from "../logic/config";
import BotCard from "./BotCard";
import UserCard from "./UserCard";
import GameContext from "../store/gameContext";
import GameCard from "./GameCard";

const { READY } = gameConfig.GAME_STATUS;

function MainPanel() {
  const gameContext = useContext(GameContext);

  useEffect(() => {
    if (gameContext.gameStatus === null) {
      if (gameContext.userCardRef.current && gameContext.botCardRef.current) {
        gameContext.userCardRef.current.style.height = `${gameContext.botCardRef.current.style.height}`;
      }
    } else if (gameContext.gameStatus === READY) {
      const userHeight = gameContext.userCardRef.current?.offsetHeight || 400;

      // Apply max height to all cards
      if (gameContext.botCardRef.current)
        gameContext.botCardRef.current.style.height = `${userHeight}px`;
      if (gameContext.gameCardRef.current)
        gameContext.gameCardRef.current.style.height = `${userHeight}px`;
      if (gameContext.summaryBoxRef.current)
        gameContext.summaryBoxRef.current.style.maxHeight = `${gameContext.summaryBoxRef.current.offsetHeight}px`;
    }
    // eslint-disable-next-line
  }, [gameContext.gameStatus]);

  return (
    <div className="inner-grid">
      <div className="column col1">
        <UserCard />
      </div>
      <div className="column col2">
        <BotCard />
      </div>
      {gameContext.gameStatus && (
        <div className="column col3">
          <GameCard />
        </div>
      )}
    </div>
  );
}

export default MainPanel;
