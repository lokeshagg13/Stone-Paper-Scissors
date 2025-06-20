import { createContext, useRef, useState } from "react";

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
    gameWinner: null,
    handLandmarksRef: null,
    userCardRef: null,
    botCardRef: null,
    gameCardRef: null,
    summaryBoxRef: null,
    changeUserName: (name) => { },
    changeBotName: (name) => { },
    setGameAsReady: () => { },
    startGame: () => { },
    restartGame: () => { },
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
    const [summary, setSummary] = useState([]);
    const [gameWinner, setGameWinner] = useState(null);
    const handLandmarksRef = useRef(null);
    const userCardRef = useRef(null);
    const botCardRef = useRef(null);
    const gameCardRef = useRef(null);
    const summaryBoxRef = useRef(null);

    function changeUserName(newUserName) {
        if (newUserName && /^[a-zA-Z ]+$/.test(newUserName)) {
            setUserName(newUserName);
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

    function resetChoices() {
        setUserChoice(null);
        setBotChoice(null);
        setUserRoundChoice(null);
        setBotRoundChoice(null);
        handLandmarksRef.current = null;
    }

    function setGameAsReady() {
        setGameStatus("ready");
        setGameRound(1);
        setNetRound(1);
        resetChoices();
        setUserScore(0);
        setBotScore(0);
        setSummary([]);
        setGameWinner(null);
    }

    function startGame() {
        if (gameStatus !== "ready") return;
        setGameStatus("started");
        setRoundStatus("started");
    }

    function restartGame() {
        setGameRound(1);
        setNetRound(1);
        resetChoices();
        setUserScore(0);
        setBotScore(0);
        setSummary([]);
        setGameWinner(null);
        setGameStatus("started");
        setRoundStatus("started");
    }

    function endGame() {
        setGameStatus("completed");
        setRoundStatus(null);
        let winner = userScore > botScore ? "user" : userScore < botScore ? "bot" : "draw";
        setGameWinner(winner);
        if (winner === "draw") {
            setSummary([
                <div key="result" className="flex flex-col items-center justify-center h-full text-yellow-500">
                    <div className="text-3xl font-bold my-10p">IT's</div>
                    <div className="text-3xl font-bold my-10p">A</div>
                    <div className="text-4xl font-bold my-10p uppercase">DRAW</div>
                </div>
            ])
        } else {
            setSummary([
                <div key="result" className={`flex flex-col items-center justify-center h-full ${winner === "user" ? "text-green-500" : "text-red-500"}`}>
                    <div className="text-4xl font-bold my-10p uppercase">{winner === "user" ? "YOU" : botName}</div>
                    <div className="text-4xl font-bold my-10p uppercase">WON</div>
                </div>
            ])
        }
    }

    function interruptGame() {
        setGameStatus(null);
        setGameRound(0);
        setNetRound(0);
        setRoundStatus(null);
        resetChoices();
        setUserScore(0);
        setBotScore(0);
        setSummary([]);
        setGameWinner(null);
    }

    function startRound() {
        setRoundStatus("started");
        setGameRound(prevRound => prevRound + 1);
        setNetRound(prevRound => prevRound + 1);
        resetChoices();
    }

    function endRound() {
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
                setSummary(prev => [
                    ...prev,
                    <div key={gameRound} className="mb-2">
                        <span className="font-bold text-blue-600">Round {gameRound}:</span>{" "}
                        <span className="text-red-500">Unable to track your move. Please try again.</span>
                    </div>,
                ])
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

        setSummary((prev) => [
            ...prev,
            <div key={gameRound} className="mb-2">
                <span className="font-bold text-blue-600">Round {gameRound}:</span>{" "}
                <span className="text-green-600">{botName} chose {botChoice}, {userName} chose {userChoice}. </span>
                <span className="font-medium">
                    {roundWinner === "draw" ? (
                        <span className="text-yellow-500">It's a draw.</span>
                    ) : (
                        <span className="text-yellow-500">Winner: {roundWinner}.</span>
                    )}
                </span>
            </div>,
        ]);
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
        gameWinner,
        userCardRef,
        botCardRef,
        gameCardRef,
        summaryBoxRef,
        changeUserName,
        changeBotName,
        setGameAsReady,
        startGame,
        restartGame,
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