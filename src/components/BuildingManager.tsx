import './Player.css'
import {Buildings} from "../Data.tsx";
import Building from "./Building.tsx";

function BuildingManager() {
    return Buildings.map(building => <Building key={building.id} building={building} />)
}

export default BuildingManager;