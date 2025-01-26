export default class NPC {
    constructor({id, name, health, color, position, personality, inventory, home, targetPositions}) {
        this.id = id;
        this.name = name;
        this.health = health;
        this.color = color;
        this.home = home;
        this.position = position;
        this.personality = personality;
        this.inventory = inventory;
        this.speed = 1; // NPCs move slower than the player
        this.targetPosition = {top: position.top, left: position.left}; // Initial target is current position
        this.targetIndex = 0;
        this.targetPositions = [];
        this.position.width = position.width || 10;
        this.position.height = position.height || 10;
    }

    generatePath(
        start,
        target,
        obstacles,
        gridWidth = 100,
        gridHeight = 100,
        cellSize = 10
    ) {
        // Create a grid and mark obstacles as non-walkable
        const grid = new PF.Grid(gridWidth, gridHeight);

        // Mark obstacle cells as blocked
        obstacles.forEach(obstacle => {
            if (!obstacle.id.includes('door') && obstacle.id !== this.id) {
                const startX = Math.floor(obstacle.left / cellSize);
                const startY = Math.floor(obstacle.top / cellSize);
                const endX = Math.floor((obstacle.left + obstacle.width) / cellSize);
                const endY = Math.floor((obstacle.top + obstacle.height) / cellSize);

                for (let x = startX; x <= endX; x++) {
                    for (let y = startY; y <= endY; y++) {
                        grid.setWalkableAt(x, y, false);
                    }
                }
            }
        });

        // Convert start and target positions to grid coordinates
        const startX = Math.floor((start.left + 5) / cellSize);
        const startY = Math.floor((start.top + 5) / cellSize);
        const targetX = Math.floor(target.left / cellSize);
        const targetY = Math.floor(target.top / cellSize);

        // Create a pathfinder
        const finder = new PF.AStarFinder({
            allowDiagonal: true,
            dontCrossCorners: true
        });

        // Find a path
        const path = finder.findPath(startX, startY, targetX, targetY, grid);

        if (path.length === 0) {
            console.error("No path found between start and target.");
            return [];
        }

        // Convert path from grid coordinates back to real coordinates
        const waypoints = path.map(([x, y]) => ({
            left: x * cellSize + cellSize / 2 - 5, // Adjust for player's center
            top: y * cellSize + cellSize / 2 - 5, // Adjust for player's center
        }));

        // Draw the grid on a canvas
        this.drawGridValues = {
            grid,
            path,
            start,
            target,
            cellSize,
        }
        this.drawGrid(this.drawGridValues);

        return waypoints;
    }

// Draw the grid on an HTML canvas
    drawGrid(params) {
        const { grid, path, start, target, cellSize } = params;
        const ctx = window._context;

        // Draw the path as a line running through the center of each square
        ctx.strokeStyle = "rgba(0,0,0,0.1)";
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();

        path.forEach(([x, y], index) => {
            const centerX = x * cellSize + cellSize / 2; // Center of the cell
            const centerY = y * cellSize + cellSize / 2; // Center of the cell

            if (index === 0) {
                // Move to the starting point of the path
                ctx.moveTo(centerX, centerY);
            } else {
                // Draw a line to the next point
                ctx.lineTo(centerX, centerY);
            }
        });

        ctx.stroke();
        ctx.setLineDash([]);
        // Draw the start and target points
        const startX = Math.floor((start.left + 5) / cellSize); // Align with center logic
        const startY = Math.floor((start.top + 5) / cellSize);
        const targetX = Math.floor(target.left / cellSize);
        const targetY = Math.floor(target.top / cellSize);

        ctx.fillStyle = "rgba(0,0,0,0.1)"; // Start point
        ctx.beginPath();
        ctx.arc(
            startX * cellSize + cellSize / 2,
            startY * cellSize + cellSize / 2,
            cellSize / 4, // Radius
            0,
            Math.PI * 2
        );
        ctx.fill();

        ctx.fillStyle = "rgba(10,255,10,0.5)"; // Target point
        ctx.beginPath();
        ctx.arc(
            targetX * cellSize + cellSize / 2,
            targetY * cellSize + cellSize / 2,
            cellSize / 4, // Radius
            0,
            Math.PI * 2
        );
        ctx.fill();
    }


    moveTowardTarget() {
        const posItem = this.targetPositions[this.targetIndex];
        if (!posItem) return;
        const deltaX = posItem.left - this.position.left;
        const deltaY = posItem.top - this.position.top;

        let newPosition = {...this.position};

        // Adjust position step-by-step toward the target
        if (Math.abs(deltaX) > 0) newPosition.left += Math.sign(deltaX) * this.speed;
        if (Math.abs(deltaY) > 0) newPosition.top += Math.sign(deltaY) * this.speed;
        newPosition.top = Math.floor(newPosition.top);
        newPosition.left = Math.floor(newPosition.left);

        // Check for collisions
        let canMove = true;
        if (window._obstacles.length) {
            for (const obstacle of window._obstacles) {
                if (obstacle.id !== this.id) {
                    if (obstacle.isColliding(newPosition, obstacle)) {
                        canMove = false;
                        break;
                    }
                }
            }
        }

        if (canMove) {
            this.position = newPosition;
            if (Math.floor(posItem.top) === Math.floor(this.position.top) && Math.floor(posItem.left) === Math.floor(this.position.left)) {
                let newTarget = this.targetPositions[this.targetIndex + 1];
                if (newTarget !== undefined) {
                    this.targetIndex++;
                } else {
                    this.drawGridValues = null;
                }
            }
            // else {
            //     window._context.fillStyle = 'white';
            //     window._context.strokeStyle = 'lightblue';
            //     window._context.beginPath();
            //     window._context.arc(posItem.left - window._camera.offsetX, posItem.top - window._camera.offsetY, 5, 0, Math.PI * 2);
            //     window._context.moveTo(this.position.left - window._camera.offsetX, this.position.top - window._camera.offsetY); // Move to point A (starting point)
            //     window._context.lineTo(posItem.left - window._camera.offsetX, posItem.top - window._camera.offsetY); // Draw a line to point B (ending point)
            //     window._context.stroke(); // Render the line
            //     window._context.strokeStyle = 'black';
            // }

            window._context.fill();
        } else {
            this.targetPositions = this.generatePath(this.position, this.targetPositions[this.targetPositions.length - 1], window._obstacles);
        }
    }

    setTarget(newTarget) {
        // Find path to new target and generate targetPositions array
        this.targetIndex = 0;
        this.targetPositions = this.generatePath(this.position, newTarget, window._obstacles);
    }

    setTargets(newTargets) {
        this.targetPositions = newTargets;
        this.targetIndex = 0;
        this.setTarget(this.targetPositions[this.targetIndex]);
    }

    render(context) {
        const {top, left, width, height} = this.position;
        context.fillStyle = this.color;
        context.beginPath();
        context.fillRect(left, top, width, height); // Draw as a circle
        context.fill();
        context.fillStyle = 'black';
        context.fillText(this.name, left - width, top - height); // Render NPC name above the circle
        if (this.drawGridValues && this.id === 'Player') {
            this.drawGrid(this.drawGridValues);
        }
        if (this.id !== 'Player') {
            window._buildings.forEach(building => {
                building.isAtDoor(this);
            });
        }
    }
}

