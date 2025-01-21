import type {Building} from "../interfaces/NPC.tsx";
import {NPCs} from "../Data.tsx";
import './Building.css';

interface BuildingProps {
    building: Building;
    updateBuildingsRef: number;
}

interface wall {
    position: 'top' | 'left' | 'right' | 'bottom',
    width: number,
    height: number,
    top: number,
    left: number
}
const wallThickness: number = 5;
const doorWH: number = 50;

function Building({building, updateBuildingsRef}: BuildingProps) {
    console.log(updateBuildingsRef, ' : updateBuildingsRef');
    const walls: Array<wall> = [
        {
            position: 'top',
            width: building.width,
            height: wallThickness,
            top: building.top,
            left: building.left
        },
        {
            position: 'left',
            width: wallThickness,
            height: building.height,
            top: building.top,
            left: building.left - wallThickness
        },
        {
            position: 'right',
            width: wallThickness,
            height: building.height,
            top: building.top,
            left: building.left + building.width
        },
        {
            position: 'bottom',
            width: building.width,
            height: wallThickness,
            top: building.top + building.height - wallThickness,
            left: building.left
        }
    ];
    let doorTop: number = 1;
    let doorLeft: number = 1;
    let topModifier: number = 0;
    let leftModifier: number = 0;
    switch (building.frontDoorFacing) {
        case 'north':
            doorTop = building.top - (doorWH / 2) + 2;
            doorLeft = building.left + building.width / 2 - (doorWH / 2);
            topModifier = -doorWH / 2 - 2 + doorWH;
        break;
        case 'south':
            doorTop = building.top + building.height - (doorWH / 2) - 2;
            doorLeft = building.left + building.width / 2 - (doorWH / 2);
            topModifier = -doorWH / 2 - 3 + doorWH;
        break;
        case 'west':
            doorTop = building.top + building.height / 2 - (doorWH / 2);
            doorLeft = building.left - (doorWH / 2) - wallThickness + 2;
            leftModifier = -doorWH / 2 - 2 + doorWH;
        break;
        case 'east':
            doorTop = building.top + building.height / 2 - (doorWH / 2);
            doorLeft = building.left + building.width - (doorWH / 2) + wallThickness - 2;
            leftModifier = -doorWH / 2 - 2 + doorWH;
    }
    return walls.map((wall: wall) => <div key={`${building.id}_wall_${wall.position}`} className={'Building'} id={`${building.id}_wall_${wall.position}`} style={{
        width: `${wall.width}px`,
        height: `${wall.height}px`,
        top: `${wall.top}px`,
        left: `${wall.left}px`
    }}/>).concat([
        <div key={`${building.id}/SENSOR/FRONT_D00R`} className={`door-sensor`}
             id={`${building.id}/SENSOR/FRONT_D00R`} style={{
            top: `${doorTop}px`,
            left: `${doorLeft}px`,
            zIndex: 2
        }}>
        </div>,
        <div key={`${building.id}/DOOR/FRONT_D00R`} className={`door ${building.open ? 'open' : ''} ${building.frontDoorFacing}`} id={`${building.id}/DOOR/FRONT_D00R`} style={{
            top: `${doorTop + topModifier}px`,
            left: `${doorLeft + leftModifier}px`,
            zIndex: 2
        }}/>,
        <div key={`${building.id}_NAME_LABEL`} className="name-label" style={{
            color: NPCs.find(npc => building.owner === npc.id)?.color || 'black',
            top: `${building.top}px`,
            left: `${building.left}px`,
            zIndex: 2
        }}>{building.name}</div>
    ]);
}

export default Building;