import {Building} from "../interfaces/NPC.tsx";
import {Inventory} from "../Data.tsx";

function DoorOptions({interactingId, sensorId, buildings, setBuildings}: {
    interactingId: string,
    sensorId: string,
    buildings: Building[],
    setBuildings: (new_buildings: Building[]) => boolean
}) {
    const building: Building | undefined = buildings.find(b => b.id === sensorId.split('/',)[0]);
    let hasKey: boolean = false;
    if (interactingId === 'Player') {
        hasKey = !!Inventory.find(item => item === building?.keyId);
    }
    // Change to object with options as keys so that an AI could select from them down the line
    if (building) {
        return <div style={{display: 'flex', flexDirection: 'column'}}>
            {!building.open && !building.locked ? <button onClick={(event): boolean => {
                event.preventDefault(); // If required
                building.locked = false;
                building.open = true;
                console.log("Update buildings");
                setBuildings(buildings);
                return false;
            }}>Open {building.name}</button> : null}
            {building.open ? <button onClick={(event): boolean => {
                event.preventDefault(); // If required
                building.open = false;
                console.log("Update buildings");
                setBuildings(buildings);
                return false;
            }}>Close {building.name}</button> : null}
            {!building.open && !building.locked && hasKey ? <button onClick={(event): boolean => {
                event.preventDefault(); // If required
                building.locked = true;
                console.log("Update buildings");
                setBuildings(buildings);
                return false;
            }}>Lock {building.name}</button> : null}
            {!building.open && building.locked && hasKey ? <button onClick={(event): boolean => {
                event.preventDefault(); // If required
                building.locked = false;
                console.log("Update buildings");
                setBuildings(buildings);
                return false;
            }}>UnLock {building.name}</button> : null}
            {!building.open && building.locked && !hasKey ? <button disabled>Need keycard to {building.name}</button> : null}
        </div>
    } else {
        return <div/>
    }
}

export default DoorOptions;