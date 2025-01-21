import './Player.css'
import {PlayerPosition} from '../interfaces/player.tsx'
import {useEffect, useState} from "react";
import {calculateNewPosition} from "../controllers/MovementController.tsx";
import NPC from "./NPC.tsx";
import InteractionManager from "./InteractionManager.tsx";
import Building from "./Building.tsx";

function Player({buildings, setBuildings}: {buildings: Building[], setBuildings: (new_buildings: Building[]) => boolean}) {
    const [playerPosition, setPlayerPosition] = useState<PlayerPosition>({left: 500, top: 400});
    const [keysPressed, setKeysPressed] = useState<{ [key: string]: boolean }>({}); // Tracks currently pressed keys
    // const [showingInteractionOptions, setShowingInteractionOptions] = useState<boolean>(false); // Tracks currently pressed keys
    const [sensorDoms, setSensorDoms] = useState<Array<Element>>([]); // Tracks currently pressed keys

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

                    // setShowingInteractionOptions(keysPressed["e"]);

                    let newPosition: NPC["position"];
                    if (direction) {
                        newPosition = calculateNewPosition({
                            prevPosition: prevPosition,
                            direction: direction,
                            walkSpeed: 1,
                            characterWidth: window._playerWidth,
                            idToMove: 'Player',
                            interactionCallBack: (sensorDoms: Array<Element>) => {
                                setSensorDoms(sensorDoms);
                            }
                        });
                    } else newPosition = prevPosition;


                    return newPosition;
                });
            };

            const interval = setInterval(() => requestAnimationFrame(updatePosition), 5); // 60 FPS update rate
            return () => clearInterval(interval);
        }, [keysPressed]
    );

    requestAnimationFrame(() => {
        const town: HTMLElement | null = document.getElementById("town");
        if (town) { // Check if the element exists
            town.style.left = (-playerPosition.left + window.innerWidth / 2) + 'px';
            town.style.top = (-playerPosition.top + window.innerHeight / 2) + 'px';
            town.style.width = window._worldWidth + 'px';
            town.style.height = window._worldHeight + 'px';
        }
    });


    return [
        <div id={"Player"} key={'player-element'} style={{
            left: playerPosition.left,
            top: playerPosition.top
        }}/>,
        <InteractionManager buildings={buildings} setBuildings={setBuildings} key={'Player-interaction-manager'} interactingId={'Player'} sensorDoms={sensorDoms} position={playerPosition}/>
    ]
}

export default Player;