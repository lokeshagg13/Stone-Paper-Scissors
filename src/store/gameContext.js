import { createContext, useRef, useState } from "react";

import constants from "./constants.js";
import { detectMove } from "../logic/detectMove.js";

const GameContext = createContext({
    gameStatus: null,
    gameRound: 0,     // updated only in case of a valid round
    netRound: 0,     // updated even in case of an invalid round
    roundStatus: null,
    userName: "User",
    botName: "Bot",
    userChoice: null,
    botChoice: null,
    userRoundChoice: null,
    botRoundChoice: null,
    userScore: 0,
    botScore: 0,
    summary: "",
    handLandmarksRef: null,
    userCardRef: null,
    botCardRef: null,
    gameCardRef: null,
    changeUserName: (name) => { },
    changeBotName: (name) => { },
    setGameAsReady: () => { },
    startGame: () => { },
    endGame: () => { },
    interruptGame: () => { },
    startRound: () => { },
    endRound: () => { },
    updateHandLandmarks: (landmarks) => { },
    detectUserChoice: () => { },
    makeBotChoice: () => { },
    updateScores: () => { },
});

export function GameContextProvider(props) {
    const [gameStatus, setGameStatus] = useState(null);
    const [gameRound, setGameRound] = useState(0);
    const [netRound, setNetRound] = useState(0);
    const [roundStatus, setRoundStatus] = useState(null);
    const [userName, setUserName] = useState("User");
    const [botName, setBotName] = useState("Bot");
    const [userChoice, setUserChoice] = useState(null);
    const [botChoice, setBotChoice] = useState(null);
    const [userRoundChoice, setUserRoundChoice] = useState(null);
    const [botRoundChoice, setBotRoundChoice] = useState(null);
    const [userScore, setUserScore] = useState(0);
    const [botScore, setBotScore] = useState(0);
    const [summary, setSummary] = useState("");
    const handLandmarksRef = useRef(null);
    const userCardRef = useRef(null);
    const botCardRef = useRef(null);
    const gameCardRef = useRef(null);

    function changeUserName(newUserName) {
        if (newUserName && /^[a-zA-Z ]+$/.test(newUserName)) {
            setUserName(userChoice);
            return true;
        }
        return false
    }

    function changeBotName(newBotName) {
        if (newBotName && /^[a-zA-Z ]+$/.test(newBotName)) {
            setBotName(newBotName);
            return true
        }
        return false;
    }

    function setGameAsReady() {
        setGameStatus("ready");
        setGameRound(1);
        setNetRound(1);
        setUserChoice(null);
        setBotChoice(null);
        setUserRoundChoice(null);
        setBotRoundChoice(null);
        setUserScore(0);
        setBotScore(0);
        setSummary("");
    }

    function startGame() {
        if (gameStatus !== "ready") return;
        setGameStatus("started");
        setRoundStatus("started");
    }

    function endGame() {
        setGameStatus("completed");
        setRoundStatus(null);
    }

    function interruptGame() {
        setGameStatus(null);
        setGameRound(0);
        setNetRound(0);
        setRoundStatus(null);
        resetChoices();
        setUserScore(0);
        setBotScore(0);
        setSummary("");
    }

    function resetChoices() {
        setUserChoice(null);
        setBotChoice(null);
        setUserRoundChoice(null);
        setBotRoundChoice(null);
    }

    function startRound() {
        setRoundStatus("started");
        resetChoices();
    }

    function endRound() {
        if (gameRound >= constants.MAX_ROUNDS) {
            endGame();
            return;
        }
        setGameRound(prevRound => prevRound + 1);
        setNetRound(prevRound => prevRound + 1);
        setRoundStatus("completed");
    }

    function updateHandLandmarks(landmarks) {
        if (landmarks !== null) {
            handLandmarksRef.current = landmarks;
        }
    }

    function detectUserChoice() {
        let retryCount = 0;
        const maxRetries = 30; // 3 seconds (30 retries with 100ms delay)
        const retryInterval = 100; // 100ms interval

        const retryDetection = setInterval(() => {
            if (handLandmarksRef.current !== null) {
                const move = detectMove(handLandmarksRef.current);
                if (move !== null) {
                    clearInterval(retryDetection);
                    if (roundStatus === "invalid") setRoundStatus("started");
                    setUserChoice(move);
                    setUserRoundChoice(`${netRound}_${move}`);
                    return;
                }
            }
            retryCount++;
            if (retryCount >= maxRetries) {
                clearInterval(retryDetection);
                setSummary(prev => `${prev}\nRound ${gameRound}: Unable to track your move. Please try again.`)
                resetChoices();
                setRoundStatus("invalid");
                setNetRound(prevRound => prevRound + 1);
            }
        }, retryInterval);
    }

    function makeBotChoice() {
        const randomChoice = ["stone", "paper", "scissors"][
            Math.floor(Math.random() * 3)
        ];
        setBotChoice(randomChoice);
        setBotRoundChoice(`${netRound}_${randomChoice}`);
    }

    function updateScores() {
        let roundWinner;
        if (botChoice === userChoice) {
            roundWinner = "draw";
        } else {
            if ((botChoice === "stone" && userChoice === "scissors") || (botChoice === "scissors" && userChoice === "paper") || (botChoice === "paper" && userChoice === "stone")) {
                roundWinner = botName;
                setBotScore(prevScore => prevScore + 1);
            }
            else {
                roundWinner = userName;
                setUserScore(prevScore => prevScore + 1);
            }
        }

        setSummary(
            (prev) =>
                `${prev}\nRound ${gameRound}: Bot chose ${botChoice}, User chose ${userChoice}. ${roundWinner === "draw"
                    ? "It's a draw"
                    : `Winner: ${roundWinner}`
                }.\n`
        );

        endRound();
    }

    const currentGameContext = {
        gameStatus,
        gameRound,
        netRound,
        roundStatus,
        userName,
        botName,
        userChoice,
        botChoice,
        userRoundChoice,
        botRoundChoice,
        userScore,
        botScore,
        summary,
        userCardRef,
        botCardRef,
        gameCardRef,
        changeUserName,
        changeBotName,
        setGameAsReady,
        startGame,
        endGame,
        interruptGame,
        startRound,
        endRound,
        updateHandLandmarks,
        makeBotChoice,
        detectUserChoice,
        updateScores,
    };

    return (
        <GameContext.Provider value={currentGameContext}>
            {props.children}
        </GameContext.Provider>
    );
}

export default GameContext;