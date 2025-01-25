export default class NPC {
    constructor({ id, name, health, color, position, personality, inventory, home}) {
        this.id = id;
        this.name = name;
        this.health = health;
        this.color = color;
        this.home = home;
        this.position = position;
        this.personality = personality;
        this.inventory = inventory;
        this.speed = 1; // NPCs move slower than the player
        this.targetPosition = { top: position.top, left: position.left }; // Initial target is current position
    }

    moveTowardTarget(buildings) {
        const deltaX = this.targetPosition.left - this.position.left;
        const deltaY = this.targetPosition.top - this.position.top;

        let newPosition = { ...this.position };

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
        }
    }


    setTarget(newTarget) {
        this.targetPosition = newTarget;
    }

    render(context) {
        const { top, left, width, height } = this.position;
        context.fillStyle = this.color;
        context.beginPath();
        context.fillRect(left, top, width, height); // Draw as a circle
        context.fill();
        context.fillStyle = 'black';
        context.fillText(this.name, left - width, top - height); // Render NPC name above the circle
    }
}

