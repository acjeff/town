import {RenderWorld} from "./world.js";
function gameLoop() {
    RenderWorld();
    requestAnimationFrame(gameLoop);
}

gameLoop();