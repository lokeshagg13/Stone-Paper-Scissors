import { useContext, useState } from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

import gameConfig from "../../logic/config";
import GameContext from "../../store/gameContext";
import EditIcon from "../ui/EditIcon";
import CrossIcon from "../ui/CrossIcon";
import CheckIcon from "../ui/CheckIcon";

const { COMPLETED } = gameConfig.GAME_STATUS;

const BotName = () => {
  const gameContext = useContext(GameContext);
  const [tempBotName, setTempBotName] = useState(gameContext.botName);
  const [isEditing, setIsEditing] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [errorText, setErrorText] = useState("");

  const openEditor = () => {
    setTempBotName(gameContext.botName);
    setNameError(false);
    setErrorText("");
    setIsEditing(true);
  };

  const resetEditor = () => {
    setIsEditing(false);
    setNameError(false);
    setErrorText("");
  };

  const handleNameChange = (newName) => {
    if (!/^[a-zA-Z\s]+$/.test(newName)) {
      setNameError(true);
      setErrorText("Bot's name must only contain alphabets and spaces.");
    } else if (newName.toLowerCase() === gameContext.userName.toLowerCase()) {
      setNameError(true);
      setErrorText("Bot's name must be different from User's name.");
    } else {
      gameContext.changeBotName(newName);
      resetEditor();
    }
  };

  const handleInputChange = (e) => {
    setTempBotName(e.target.value);
    setNameError(false);
    setErrorText("");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleNameChange(tempBotName);
    }
    if (event.key === "Escape") {
      resetEditor();
    }
  };

  return (
    <div
      className={`text-center card-title flex items-center justify-center gap-1r ${
        nameError ? "shake" : ""
      }`}
    >
      {gameContext.gameStatus === null ||
      gameContext.gameStatus === COMPLETED ? (
        isEditing ? (
          <>
            <OverlayTrigger
              show={nameError}
              placement="top"
              delay={{ show: 250, hide: 400 }}
              overlay={<Tooltip id="errorMessage2">{errorText}</Tooltip>}
            >
              <input
                type="text"
                value={tempBotName}
                onChange={(e) => handleInputChange(e)}
                onKeyDown={handleKeyDown}
                className={`border rounded px-2 py-1 text-center ${
                  nameError ? "border-red-600" : ""
                }`}
                autoFocus
              />
            </OverlayTrigger>
            <button
              type="button"
              className="cursor-pointer"
              onClick={() => handleNameChange(tempBotName)}
            >
              <CheckIcon fillColor="rgb(22, 163, 74)" />
            </button>
            <button
              type="button"
              className="cursor-pointer"
              onClick={() => resetEditor()}
            >
              <CrossIcon fillColor="rgb(220, 38, 38)" />
            </button>
          </>
        ) : (
          <>
            <span>{gameContext.botName}</span>
            <button
              type="button"
              className="cursor-pointer"
              onClick={() => openEditor()}
            >
              <EditIcon width="0.8em" fillColor="#2563eb" />
            </button>
          </>
        )
      ) : (
        <span>{gameContext.botName}</span>
      )}
    </div>
  );
};

export default BotName;
