import { Buildings, NPCs, Inventory } from "./data.js";
import {renderInteractionPrompt} from "./InteractionOptions.js";
import Building from "./building.js";
import NPC from "./npc.js";
import Player from "./player.js";
import InputHandler from "./InputHandler.js";
import Camera from "./camera.js";
// Canvas setup
window._canvas = document.getElementById("gameCanvas");
window._context = window._canvas.getContext('2d');
// Canvas setup

window._obstacles = [];
window._sensors = [];
window._interactionOptions = [];
window._canvas.width = window.innerWidth;
window._canvas.height = window.innerHeight;
window._context.fillStyle = "lightblue";
window._context.fillRect(0, 0, window._canvas.width, window._canvas.height);

let keyPressed = false;

const setCanvasResolution = () => {
    const canvas = window._canvas;
    const context = window._context;

    // Get device pixel ratio
    const dpr = window.devicePixelRatio || 1;

    // Adjust canvas size for high-resolution rendering
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;

    // Scale the canvas back to the intended display size
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    // Scale the rendering context to match the device pixel ratio
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

// window.addEventListener('mousemove', (evt) => {
//     const rect = window._canvas.getBoundingClientRect();
//     const mouseX = evt.clientX - rect.left;
//     const mouseY = evt.clientY - rect.top;
//     if (window._player.moveFromClick) {
//         window._player.targetPosition.top = mouseY;
//         window._player.targetPosition.left = mouseX;
//     }
// });

// window.addEventListener('mousedown', (evt) => {

// });



// window.addEventListener('mouseup', (evt) => {
//     window._player.moveFromClick = false;
// });

// Create instances
const inputHandler = new InputHandler();
window._player = new Player({
    id: 'Player',
    name: 'Player',
    health: 100,
    color: 'blue',
    position: { top: 600, left: 600 , width: 15, height: 15 },
    inventory: Inventory
});
const camera = new Camera(window._canvas, window._player);
window._camera = camera;
window._buildings = Buildings.map(building => new Building(building));
window._npcs = NPCs.map(npc => new NPC(npc));

// NPC target update logic
setInterval(() => {
    window._npcs.forEach(npc => {
        // Assign a random target position within canvas bounds
        // const randomTarget = {
        //     top: Math.random() * window._canvas.height,
        //     left: Math.random() * window._canvas.width,
        // };
        const homeBuilding = window._buildings.find(b => b.id === npc.home);
        npc.setTarget(homeBuilding.position);
    });
}, 3000); // Update every 3 seconds


// Main render loop
export function RenderWorld() {
    // Clear the canvas
    camera.context.clearRect(0, 0, camera.canvas.width, camera.canvas.height);

    // Update player movement and check for collisions
    window._player.move(inputHandler, window._buildings);

    // Update camera position
    camera.update();

    camera.context.save(); // Save the current context state
    camera.context.translate(-camera.offsetX, -camera.offsetY); // Translate based on camera offset

    // Render all entities
    window._buildings.forEach(building => building.render(window._context));
    window._npcs.forEach(npc => npc.render(window._context));
    window._player.render(window._context);

    // Restore context to prevent affecting other renders
    camera.context.restore();

    // Show interaction prompts
    renderInteractionPrompt(window._context, window._player, window._buildings);

    // Update NPC movements, considering collisions with buildings
    window._npcs.forEach(npc => npc.moveTowardTarget(window._buildings));
}
setCanvasResolution();

// Game loop
function gameLoop() {
    RenderWorld();
    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();
