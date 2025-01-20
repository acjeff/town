import type {Building} from "../interfaces/NPC.tsx";
import {NPCs} from "../Data.tsx";
import './Building.css';

interface NPCProps {
    building: Building;
}

function Building({building}: NPCProps) {

    return (
        <div
            id={`${building.id}`}
            className={`Building`}
            style={{
                width: `${building.width}px`,
                height: `${building.height}px`,
                top: `${building.top}px`,
                left: `${building.left}px`
            }}>
            <div className={`door-sensor ${building.frontDoorFacing}`}>
                <div className={'door'}/>
            </div>
            <div className="name-label" style={{
                color: NPCs.find(npc => building.owner === npc.id)?.color || 'black',
            }}>{building.name}</div>
        </div>
    );
}

export default Building;