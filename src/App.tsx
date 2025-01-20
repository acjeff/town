import './App.css';
import Player from "./components/Player.tsx";
import NPCManager from "./components/NPCManager.tsx";
import BuildingManager from "./components/BuildingManager.tsx";

declare global {
    interface Window {
        _worldWidth: number;
        _worldHeight: number;
        _playerWidth: number;
    }
}
window._worldWidth = 5000;
window._worldHeight = 5000;
window._playerWidth = 10;

function App() {
    return (
        <div id="camera">
            <div id="town">
                <Player/>
                <NPCManager/>
                <BuildingManager/>
            </div>
        </div>
    );
}

export default App;
