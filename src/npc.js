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
        this.retryInterval = null;
        this.lineDashOffset = 0
        // this.startPathfinding();
    }

    generatePath(
        start,
        target,
        obstacles,
        gridWidth = Math.ceil(window._canvas.width / 20),
        gridHeight = Math.ceil(window._canvas.height / 20),
        cellSize = 20
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
        const finder = new PF.BestFirstFinder({
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

// Draw the grid on an HTML canva

    drawGrid(params) {
        const {grid, path, start, target, cellSize} = params;
        const ctx = window._context;

        // Set canvas dimensions
        const canvasWidth = window._canvas.width;
        const canvasHeight = window._canvas.height;

        // Draw the grid in light grey (optional, uncomment if needed)
        // ctx.strokeStyle = "rgba(200, 200, 200, 0.3)"; // Light grey color
        // ctx.lineWidth = 1;
        //
        // for (let x = 0; x <= canvasWidth; x += cellSize) {
        //     ctx.beginPath();
        //     ctx.moveTo(x, 0);
        //     ctx.lineTo(x, canvasHeight);
        //     ctx.stroke();
        // }
        //
        // for (let y = 0; y <= canvasHeight; y += cellSize) {
        //     ctx.beginPath();
        //     ctx.moveTo(0, y);
        //     ctx.lineTo(canvasWidth, y);
        //     ctx.stroke();
        // }

        // Simulate moving dashed line for the path
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]); // Dash pattern: [dash length, gap length]
        ctx.lineDashOffset = this.lineDashOffset; // Apply animated offset
        ctx.beginPath();

        path.forEach(([x, y], index) => {
            if (index > this.targetIndex - 1) {
                const centerX = x * cellSize + cellSize / 2; // Center of the cell
                const centerY = y * cellSize + cellSize / 2; // Center of the cell

                if (index === 0) {
                    // Move to the starting point of the path
                    ctx.moveTo(centerX, centerY);
                } else {
                    // Draw a line to the next point
                    ctx.lineTo(centerX, centerY);
                }
            }
        });

        ctx.stroke();
        ctx.setLineDash([]); // Reset dash style

        // Draw the start and target points
        const targetX = Math.floor(target.left / cellSize);
        const targetY = Math.floor(target.top / cellSize);
        ctx.fillStyle = this.color; // Target point
        ctx.beginPath();
        ctx.arc(
            targetX * cellSize + cellSize / 2,
            targetY * cellSize + cellSize / 2,
            cellSize / 6, // Radius
            0,
            Math.PI * 2
        );
        ctx.fill();
        ctx.strokeStyle = 'black';
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

        this.canMove = canMove;

        if (canMove) {
            if (Math.floor(posItem.top) === Math.floor(this.position.top) && Math.floor(posItem.left) === Math.floor(this.position.left)) {
                let newTarget = this.targetPositions[this.targetIndex + 1];
                if (newTarget !== undefined) {
                    this.targetIndex++;
                } else {
                    this.drawGridValues = null;
                    this.targetPositions = [];
                }
            }
            window._context.fill();
            this.position = newPosition;
        }
    }

    // startPathfinding() {
    //     setInterval(() => {
    //         // Check if a valid path already exists
    //         if (!this.targetPositions.length || !this.canMove) {
    //             return;
    //         }
    //
    //         // Attempt to generate a path
    //         console.log('Find a new path');
    //         this.generatePath(this.position, this.targetPositions[this.targetPositions.length - 1], window._obstacles);
    //     }, 2000); // Retry every 2 seconds (adjust as needed)
    // }

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
        // if (this.drawGridValues && this.id === 'Player') {
        if (this.drawGridValues) {
            this.lineDashOffset -= 1; // Decrement to simulate pulling effect
            if (this.lineDashOffset < -20) this.lineDashOffset = 0; // Reset for smooth looping
            this.drawGrid(this.drawGridValues);
        }
        if (this.id !== 'Player') {
            window._buildings.forEach(building => {
                building.isAtDoor(this);
            });
        }
    }
}

