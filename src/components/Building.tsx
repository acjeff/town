import type {Building} from "../interfaces/NPC.tsx";
import {NPCs} from "../Data.tsx";
import './Building.css';

interface NPCProps {
    building: Building;
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

function Building({building}: NPCProps) {
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
    switch (building.frontDoorFacing) {
        case 'north':
            doorTop = building.top - (doorWH / 2) + 2;
            doorLeft = building.left + building.width / 2 - (doorWH / 2);
        break;
        case 'south':
            doorTop = building.top + building.height - (doorWH / 2) - 2;
            doorLeft = building.left + building.width / 2 - (doorWH / 2);
        break;
        case 'west':
            doorTop = building.top + building.height / 2 - (doorWH / 2);
            doorLeft = building.left - (doorWH / 2) - wallThickness + 2;
        break;
        case 'east':
            doorTop = building.top + building.height / 2 - (doorWH / 2);
            doorLeft = building.left + building.width - (doorWH / 2) + wallThickness - 2;
    }
    return walls.map((wall: wall) => <div key={`${building.id}_wall_${wall.position}`} className={'Building'} id={`${building.id}_wall_${wall.position}`} style={{
        width: `${wall.width}px`,
        height: `${wall.height}px`,
        top: `${wall.top}px`,
        left: `${wall.left}px`
    }}/>).concat([
        <div key={`${building.id}_SENSOR`} className={`door-sensor`}
             id={`${building.id}_SENSOR`} style={{
            top: `${doorTop}px`,
            left: `${doorLeft}px`,
            zIndex: 2
        }}>
        </div>,
        <div key={`${building.id}_DOOR`} className={`door ${building.open ? 'open' : ''} ${building.frontDoorFacing}`} id={`${building.id}_DOOR`} style={{
            top: `${doorTop + doorWH / 2}px`,
            left: `${doorLeft}px`,
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