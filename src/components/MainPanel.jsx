import { useContext } from "react";

import BotCard from "./BotCard";
import UserCard from "./UserCard";
import GameContext from "../store/gameContext";
import GameCard from "./GameCard";

function MainPanel() {
  const gameContext = useContext(GameContext);

  return (
    <div className="inner-grid">
      <div className="column col1">
        <UserCard />
      </div>
      <div className="column col2">
        <BotCard />
      </div>
      {gameContext.gameStatus !== null && (
        <div className="column col3">
          <GameCard />
        </div>
      )}
    </div>
  );
}

export default MainPanel;
