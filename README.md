# ✨ Stone Paper Scissors ✨

Welcome to **Stone Paper Scissors**, an engaging and interactive game built using React.js. This game leverages **MediaPipe JS** for hand landmark detection, enabling a unique gameplay experience where your webcam detects your hand gestures as game choices. 🎮🖐️

---

## 🔧 Features

* **Hand Gesture Recognition**: Uses MediaPipe JS to detect your hand gestures via webcam.
* **Dynamic Gameplay**: Supports real-time gesture-based inputs (Stone 💪, Paper 🖐️, Scissors ✌️).
* **Immersive UI**: Vibrant graphics and intuitive design for a seamless gaming experience.
* **Audio Feedback**: Enjoy fun sound effects like winning, losing, or drawing moments.
* **Responsive Design**: Optimized for various devices to ensure smooth gameplay.

---

## 🔮 Technology Stack

* **Frontend**: React.js
* **Gesture Recognition**: MediaPipe JS
* **State Management**: React Context API
* **Media**: Images and audio for enhanced experience

---

## 🗋 File Structure

```plaintext
Stone Paper Scissors/
├── package.json
├── src/
    ├── App.jsx
    ├── index.jsx
    ├── images/
    │   ├── won.png
    │   ├── paper.png
    │   ├── lost.png
    │   ├── draw.png
    │   ├── scissors.png
    │   ├── stone.png
    │   ├── header.png
    │   ├── ui.png
    ├── logic/
    │   ├── detectMove.js
    │   ├── vectorUtils.js
    │   ├── config.js
    ├── components/
    │   ├── GameCard.jsx
    │   ├── BotCard.jsx
    │   ├── UserCard.jsx
    │   ├── MainPanel.jsx
    │   ├── Webcam.jsx
    │   ├── ui/
    │   │   ├── CheckIcon.jsx
    │   │   ├── EditIcon.jsx
    │   │   ├── CrossIcon.jsx
    │   ├── names/
    │       ├── UserName.jsx
    │       ├── BotName.jsx
    ├── audio/
    │   ├── SPS.mp3
    ├── store/
        ├── gameContext.js
```

---

## 🔎 How It Works

1. **Hand Gesture Detection**: Uses MediaPipe to track hand landmarks.
2. **Game Logic**: The `detectMove.js` script translates hand gestures into Stone, Paper, or Scissors.
3. **Game Round**: Compares user input with the bot's choice and determines the winner.
4. **UI Updates**: Updates the UI dynamically to display results and provide feedback.

---

## ⚖️ Future Enhancements

* **Multiplayer Mode**: Play with friends over a local network or online.
* **Customizable Themes**: Introduce theme packs for UI personalization.
* **Leaderboard**: Keep track of player scores globally.
* **Gesture Tutorials**: Add a tutorial to guide users on how to perform gestures accurately.
* **AI-Driven Bot**: Enhance the bot with machine learning for smarter gameplay.

---

## 🛠️ Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/lokeshagg13/Stone-Paper-Scissors.git
   ```
2. Navigate to the project directory:

   ```bash
   cd Stone-Paper-Scissors 
   ```
3. Install dependencies:

   ```bash
   npm install
   ```
4. Start the development server:

   ```bash
   npm start
   ```

---

## 🎮 Gameplay Instructions

1. **Setup**: Allow webcam access when prompted.
2. **Play**: Use your hand gestures to select Stone, Paper, or Scissors.
3. **Results**: Check the outcome on the screen and enjoy the fun feedback!

---

## 📖 License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

---

## 📲 Connect

* **GitHub**: [My GitHub Profile](https://github.com/lokeshagg13)
* **Email**: [lkaggarwal1997@gmail.com](mailto:lkaggarwal1997@gmail.com)

Happy gaming! 🎮
