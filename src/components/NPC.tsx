import './NPC.css';
import type {NPC} from "../interfaces/NPC.tsx";
import {useEffect, useState} from "react";
import {calculateNewPosition} from "../controllers/MovementController.tsx";

interface NPCProps {
    npc: NPC;
    updatePosition: (position: NPC["position"]) => void;
}

const getRandomDirection = (): string => {
    const directions = ['up', 'down', 'left', 'right'];
    return directions[Math.floor(Math.random() * directions.length)];
};

function NPC({npc, updatePosition}: NPCProps) {
    const [direction, setDirection] = useState<string>(getRandomDirection());

    // Change direction every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setDirection(getRandomDirection());
        }, 2000);

        return () => clearInterval(interval); // Cleanup interval on unmount
    }, []);

    // Update NPC position based on direction
    useEffect(() => {
        const interval = setInterval(() => {
            updatePosition(calculateNewPosition({
                prevPosition: npc.position,
                direction: direction,
                walkSpeed: 1,
                characterWidth: 10,
                idToMove: npc.id,
                callback: (newDirection: string) => {
                    if (newDirection) {
                        setDirection(newDirection);
                        // updatePosition(calculateNewPosition({
                        //     prevPosition: npc.position,
                        //     direction: newDirection,
                        //     walkSpeed: 1,
                        //     characterWidth: 10,
                        //     idToMove: npc.id
                        // }));
                    }
                    return true;
                }
            }));
        }, 16);

        return () => clearInterval(interval); // Cleanup interval on unmount
    }, [npc, direction, updatePosition]);

    return (
        <div
            id={`${npc.id}`}
            className={`NPC`}
            style={{
                backgroundColor: npc.color,
                left: npc.position.left,
                top: npc.position.top,
            }}>
            <div className="name-label">{npc.name}</div>
        </div>
    );
}

export default NPC;