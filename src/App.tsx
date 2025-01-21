import './App.css';
import Player from "./components/Player.tsx";
import NPCManager from "./components/NPCManager.tsx";
import BuildingManager from "./components/BuildingManager.tsx";
import {Buildings} from "./Data.tsx";
import {useState} from "react";
import {Building} from "./interfaces/NPC.tsx";

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

    const [buildings, setBuildings] = useState<Building[]>(Buildings);
    const [updateBuildingsRef, setUpdateBuildingsRef] = useState<number>(1);

    function updateBuildings(new_buildings: Building[]): boolean {
        console.log("Update buildings with: ", new_buildings);
        setBuildings(new_buildings);
        setUpdateBuildingsRef(updateBuildingsRef + 1);
        return true;
    }

    return (
        <div id="camera">
            <div id="town">
                <Player buildings={buildings} setBuildings={updateBuildings}/>
                <NPCManager buildings={buildings}/>
                <BuildingManager updateBuildingsRef={updateBuildingsRef} buildings={buildings}/>
            </div>
        </div>
    );
}

export default App;
