import NPC from './npc.js';

export default class Player extends NPC {
    constructor({id, name, health, color, position, inventory}) {
        super({id, name, health, color, position, personality: null, inventory});
        this.speed = 1; // Movement speed
    }

    move(inputHandler, buildings) {
        let newPosition = {...this.targetPosition};
        let pressingKey;
        // if (this.moveFromClick) {

        // } else {
        if (inputHandler.isKeyPressed('w')) {
            pressingKey = true;
            newPosition = {...this.position};
            newPosition.top -= this.speed; // Up
        }
        if (inputHandler.isKeyPressed('s')) {
            pressingKey = true;
            newPosition = {...this.position};
            newPosition.top += this.speed;
        }
        if (inputHandler.isKeyPressed('a')) {
            pressingKey = true;
            newPosition = {...this.position};
            newPosition.left -= this.speed;
        }
        if (inputHandler.isKeyPressed('d')) {
            pressingKey = true;
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
        if (pressingKey) {
            this.targetIndex = 0;
            this.targetPositions = [newPosition];
            this.drawGridValues = null;
        }
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

