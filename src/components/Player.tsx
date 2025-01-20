import './Player.css'
import {PlayerPosition} from '../interfaces/player.tsx'
import {useEffect, useState} from "react";
import {calculateNewPosition} from "../controllers/MovementController.tsx";
import NPC from "./NPC.tsx";

function Player() {
    const [playerPosition, setPlayerPosition] = useState<PlayerPosition>({left: 0, top: 0});
    const [keysPressed, setKeysPressed] = useState<{ [key: string]: boolean }>({}); // Tracks currently pressed keys

    // Movement handler
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            setKeysPressed((prevKeys) => ({...prevKeys, [e.key]: true}));
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            setKeysPressed((prevKeys) => ({...prevKeys, [e.key]: false}));
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, []);

    // Update position based on keys pressed
    useEffect(() => {
            const updatePosition = () => {
                setPlayerPosition((prevPosition) => {
                    let direction: string | undefined;
                    if ((keysPressed["w"] || keysPressed["ArrowUp"])) {
                        direction = 'up';
                    } else if ((keysPressed["s"] || keysPressed["ArrowDown"])) {
                        direction = 'down';
                    } else if ((keysPressed["a"] || keysPressed["ArrowLeft"])) {
                        direction = 'left';
                    } else if ((keysPressed["d"] || keysPressed["ArrowRight"])) {
                        direction = 'right';
                    }

                    let newPosition: NPC["position"];
                    if (direction) {
                        newPosition = calculateNewPosition({
                            prevPosition: prevPosition,
                            direction: direction,
                            walkSpeed: 5,
                            characterWidth: window._playerWidth,
                            idToMove: 'Player'
                        });
                    } else newPosition = prevPosition;


                    return newPosition;
                });
            };

            const interval = setInterval(updatePosition, 16); // 60 FPS update rate
            return () => clearInterval(interval);
        }, [keysPressed]
    );

    // setInterval(() => {
    const town: HTMLElement | null = document.getElementById("town");
    if (town) { // Check if the element exists
        town.style.left = (-playerPosition.left + window.innerWidth / 2) + 'px';
        town.style.top = (-playerPosition.top + window.innerHeight / 2) + 'px';
        town.style.width = window._worldWidth + 'px';
        town.style.height = window._worldHeight + 'px';
    }
    // }, 16)

    return (
        <div id={"Player"} style={{
            left: playerPosition.left,
            top: playerPosition.top
        }}/>
    )
}

export default Player;