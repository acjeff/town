import {Buildings, NPCs, Inventory} from "./data.js";
import {renderInteractionPrompt} from "./InteractionOptions.js";
import Building from "./building.js";
import NPC from "./npc.js";
import Player from "./player.js";
import InputHandler from "./InputHandler.js";
import Camera from "./camera.js";
import {createObstacles} from "./obstacleService.js";
import Obstacle from "./obstacle.js";
import manageWorldTimeAndRender from "./worldClock.js";
window._canvas = document.getElementById("gameCanvas");
window._context = window._canvas.getContext('2d');
window._context.font = "12px Arial"; // Set font size to 20px and font family to Arial
window._obstacles = [];
window._sensors = [];
window._interactionOptions = [];

let keyPressed = false;

const setCanvasResolution = () => {
    const canvas = window._canvas;
    const context = window._context;

    const dpr = window.devicePixelRatio || 1;

    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;

    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    context.scale(dpr, dpr);
};

window.addEventListener('keydown', (evt) => {
    if (evt.key === 'e' && !keyPressed) {
        keyPressed = true; // Mark the key as pressed
        window._sensors.forEach(sensor => sensor.interact(window._player));
    }
});

window.addEventListener('keyup', (evt) => {
    if (evt.key === 'e') {
        keyPressed = false; // Reset the key state when released
    }
});

// Create instances
const inputHandler = new InputHandler();
window._player = new Player({
    id: 'Player',
    name: 'Player',
    health: 100,
    color: 'blue',
    position: {top: 450, left: 450, width: 10, height: 10},
    inventory: Inventory
});

const camera = new Camera(window._canvas, window._player);
window._camera = camera;
window._buildings = Buildings.map(building => new Building(building));
window._npcs = NPCs.map(npc => new NPC(npc));

setTimeout(() => {
    window._npcs.forEach(npc => {
        const homeBuilding = window._buildings.find(b => b.id === npc.home);
        npc.setTarget({
            top: homeBuilding.position.top + homeBuilding.position.height / 2,
            left: homeBuilding.position.left + homeBuilding.position.width / 2
        });
    });
}, 100);
// setTimeout(() => {
//     window._npcs.forEach(npc => {
//         const homeBuilding = window._buildings[Math.floor(Math.random() * window._buildings.length)];
//         npc.setTarget({
//             top: homeBuilding.position.top + homeBuilding.position.height / 2,
//             left: homeBuilding.position.left + homeBuilding.position.width / 2
//         });
//     });
// }, 100);

if (!window._obstacles.length) {
    window._obstacles = window._npcs.map(npc => new Obstacle({
        id: npc.id,
        top: npc.position.top,
        left: npc.position.left,
        width: 10,
        height: 10,
    }));
}

export function RenderWorld() {
    camera.context.clearRect(0, 0, camera.canvas.width, camera.canvas.height);
    camera.update();
    camera.context.save(); // Save the current context state
    camera.context.scale(camera.zoom, camera.zoom); // Apply zoom
    camera.context.translate(-camera.offsetX, -camera.offsetY); // Translate based on camera offset
    window._buildings.forEach(building => building.render(window._context));
    window._npcs.forEach(npc => npc.render(window._context));
    window._player.render(window._context);
    window._npcs.forEach(npc => npc.moveTowardTarget(window._buildings));
    window._player.move(inputHandler, window._buildings);
    window._obstacles.forEach((obstacle) => {
        let npcObstacle = window._npcs.find(npc => npc.id === obstacle.id);
        if (npcObstacle) {
            obstacle.top = npcObstacle.position.top;
            obstacle.left = npcObstacle.position.left;
        }
    });
    manageWorldTimeAndRender(window._canvas)

    camera.context.restore();
    renderInteractionPrompt(window._context, window._player, window._buildings);
}

setCanvasResolution();

const FPS = 60; // Desired frame rate
const frameDuration = 1000 / FPS; // Time for each frame in milliseconds
let lastTime = 0;

function gameLoop(timestamp) {
    const delta = timestamp - lastTime;

    if (delta >= frameDuration) {
        lastTime = timestamp; // Update the last time to the current time
        RenderWorld(); // Call the rendering function
    }

    requestAnimationFrame(gameLoop); // Continue the loop
}

gameLoop(0); // Start the loop