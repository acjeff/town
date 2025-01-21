import './Player.css'
import Building from "./Building.tsx";

function BuildingManager({buildings, updateBuildingsRef}: {buildings: Building[], updateBuildingsRef: number}) {
    return buildings.map(building => <Building updateBuildingsRef={updateBuildingsRef} key={building.id} building={building} />)
}

export default BuildingManager;