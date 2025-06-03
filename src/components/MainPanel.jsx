import { useContext, useEffect } from "react";
import BotCard from "./BotCard";
import UserCard from "./UserCard";
import GameContext from "../store/gameContext";
import GameCard from "./GameCard";

function MainPanel() {
  const gameContext = useContext(GameContext);

  useEffect(() => {
    if (gameContext.gameStatus !== "ready") return;
    const userHeight = gameContext.userCardRef.current?.offsetHeight || 400;
    console.log(userHeight);

    // Apply max height to all cards
    if (gameContext.botCardRef.current)
      gameContext.botCardRef.current.style.height = `${userHeight}px`;
    if (gameContext.gameCardRef.current)
      gameContext.gameCardRef.current.style.height = `${userHeight}px`;
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
