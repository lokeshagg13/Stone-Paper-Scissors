const config = {
    MAX_ROUNDS: 5,
    DEFAULT_USER_NAME: "User",
    DEFAULT_BOT_NAME: "Bot",
    CHOICE: {
        STONE: 0,
        PAPER: 1,
        SCISSORS: 2
    },
    GAME_STATUS: {
        READY: 0,
        STARTED: 1,
        COMPLETED: 2
    },
    ROUND_STATUS: {
        INVALID: 0,
        STARTED: 1,
        COMPLETED: 2
    },
    WINNER: {
        DRAW: 0,
        USER: 1,
        BOT: 2
    }
}

export default config;