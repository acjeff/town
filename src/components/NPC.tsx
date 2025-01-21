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
        let randomDuration = Math.floor(Math.random() * (4000 - 1000 + 1)) + 1000;
        const interval = setInterval(() => {
            setDirection(getRandomDirection());
        }, randomDuration);

        return () => clearInterval(interval); // Cleanup interval on unmount
    }, []);

    // Update NPC position based on direction
    useEffect(() => {
        const interval = setInterval(() => requestAnimationFrame(() => {
            updatePosition(calculateNewPosition({
                prevPosition: npc.position,
                direction: direction,
                walkSpeed: 1,
                characterWidth: 10,
                idToMove: npc.id,
                callback: (newDirection: string) => {
                    if (newDirection) {
                        setDirection(newDirection);
                    }
                    return true;
                }
            }));
        }), 5); // 60 FPS update rate
        return () => clearInterval(interval);
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