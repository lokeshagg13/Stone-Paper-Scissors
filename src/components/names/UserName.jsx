import { forwardRef, useContext, useState } from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

import GameContext from "../../store/gameContext";
import EditIcon from "../ui/EditIcon";
import CrossIcon from "../ui/CrossIcon";
import CheckIcon from "../ui/CheckIcon";

const UserName = forwardRef((_, ref) => {
  const gameContext = useContext(GameContext);
  const [tempUserName, setTempUserName] = useState(gameContext.userName);
  const [isEditing, setIsEditing] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [errorText, setErrorText] = useState("");

  const openEditor = () => {
    setTempUserName(gameContext.userName);
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
      setErrorText("User's name must only contain alphabets and spaces.");
    } else if (newName.toLowerCase() === gameContext.botName.toLowerCase()) {
      setNameError(true);
      setErrorText("User's name must be different from Bot's name.");
    } else {
      gameContext.changeUserName(newName);
      resetEditor();
    }
  };

  const handleInputChange = (e) => {
    setTempUserName(e.target.value);
    setNameError(false);
    setErrorText("");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleNameChange(tempUserName);
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
      ref={ref}
    >
      {gameContext.gameStatus === null ||
      gameContext.gameStatus === "completed" ? (
        isEditing ? (
          <>
            <OverlayTrigger
              show={nameError}
              placement="top"
              delay={{ show: 250, hide: 400 }}
              overlay={<Tooltip id="errorMessage">{errorText}</Tooltip>}
            >
              <input
                type="text"
                value={tempUserName}
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
              onClick={() => handleNameChange(tempUserName)}
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
            <span>{gameContext.userName}</span>
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
        <span>{gameContext.userName}</span>
      )}
    </div>
  );
});

export default UserName;
