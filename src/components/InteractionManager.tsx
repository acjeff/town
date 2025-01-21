import './InteractionManager.css';
import {Building, NPC} from '../interfaces/NPC'
import DoorOptions from "./DoorOptions.tsx";
import {ReactNode} from "react";

function InteractionManager({position, sensorDoms, interactingId, buildings, setBuildings}: {
    showing: boolean,
    position: NPC["position"],
    sensorDoms: Array<Element>,
    interactingId: NPC["id"],
    buildings: Building[],
    setBuildings: (new_buildings: Building[]) => boolean
}) {
    // if (showing) {
        return <div className={'interaction-menu'} style={{left: position.left + 20, top: position.top}}>
            {sensorDoms.map((element: Element): ReactNode | undefined => {
                if (element.id.includes('SENSOR') && element.id.includes('D00R')) {
                    return <DoorOptions buildings={buildings} setBuildings={setBuildings} key={element.id + Math.random()} interactingId={interactingId}
                                        sensorId={element.id}/>
                } else return undefined;
            })}
        </div>
    // } else {
    //     return;
    // }
}

export default InteractionManager;