import MainPanel from "./components/MainPanel";
import HeaderImage from "./images/header.png";

function App() {
  return (
    <div className="app p-4 bg-dark-blue min-h-screen app-grid">
      <div className="flex items-center justify-center mb-4">
        <img src={HeaderImage} alt="Rock Paper Scissors" className=" w-auto h-full" />
      </div>
      <MainPanel />
    </div>
  );
}

export default App;
