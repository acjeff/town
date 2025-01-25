import NPC from './npc.js';

export default class Player extends NPC {
    constructor({id, name, health, color, position, inventory}) {
        super({id, name, health, color, position, personality: null, inventory});
        this.speed = 1; // Movement speed
    }

    moveTowardTarget() {
        const deltaX = this.targetPosition.left - this.position.left;
        const deltaY = this.targetPosition.top - this.position.top;

        let newPosition = {...this.position};

        // Adjust position step-by-step toward the target
        if (Math.abs(deltaX) > 0) newPosition.left += Math.sign(deltaX) * this.speed;
        if (Math.abs(deltaY) > 0) newPosition.top += Math.sign(deltaY) * this.speed;

        // Check for collisions
        let canMove = true;
        if (window._obstacles.length) {
            for (const obstacle of window._obstacles) {
                if (obstacle.isColliding(newPosition, obstacle)) {
                    canMove = false;
                    break;
                }
            }
        }

        if (canMove) {
            this.position = newPosition;
            if (this.targetPosition.top !== this.position.top) {
                window._context.fillStyle = 'white';
                window._context.strokeStyle = 'lightblue';
                window._context.beginPath();
                window._context.arc(this.targetPosition.left - window._camera.offsetX, this.targetPosition.top - window._camera.offsetY, 5, 0, Math.PI * 2);
                window._context.moveTo(this.position.left - window._camera.offsetX, this.position.top - window._camera.offsetY); // Move to point A (starting point)
                window._context.lineTo(this.targetPosition.left - window._camera.offsetX, this.targetPosition.top - window._camera.offsetY); // Draw a line to point B (ending point)
                window._context.stroke(); // Render the line
                window._context.strokeStyle = 'black';
            }

            window._context.fill();
        }
    }

    move(inputHandler, buildings) {
        let newPosition = {...this.targetPosition};
        // if (this.moveFromClick) {

        // } else {
        if (inputHandler.isKeyPressed('w')) {
            newPosition = {...this.position};
            newPosition.top -= this.speed; // Up
        }
        if (inputHandler.isKeyPressed('s')) {
            newPosition = {...this.position};
            newPosition.top += this.speed;
        }
        if (inputHandler.isKeyPressed('a')) {
            newPosition = {...this.position};
            newPosition.left -= this.speed;
        }
        if (inputHandler.isKeyPressed('d')) {
            newPosition = {...this.position};
            newPosition.left += this.speed;
        }

        // Check for collisions with buildings
        let canMove = true;
        if (window._obstacles.length) {
            for (const obstacle of window._obstacles) {
                if (obstacle.isColliding(newPosition, obstacle)) {
                    canMove = false;
                    break;
                }
            }
        }

        // if (canMove) {
        // this.position = newPosition;
        this.targetPosition = newPosition;
        // }
        this.moveTowardTarget();
        // }
    }

    interact(buildings) {
        for (const building of buildings) {
            const inProximity = (
                Math.abs(this.position.top - building.position.top) < 50 &&
                Math.abs(this.position.left - building.position.left) < 50
            );
            if (inProximity && !building.locked) {
                console.log(`You entered ${building.name}`);
            } else if (inProximity && building.locked) {
                console.log(`${building.name} is locked.`);
            }
        }
    }
}

