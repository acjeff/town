export default class NPC {
    constructor({id, name, health, color, position, personality, inventory, home, schedule}) {
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
        this.schedule = schedule;
        this.lineDashOffset = 0
    }

    startPause(callback, pauseDuration = 2000) {
        this.isPaused = true; // Prevent new targets from being set
        setTimeout(() => {
            this.isPaused = false; // Allow new movement after the pause
            callback(); // Execute the callback (e.g., set a new target)
        }, pauseDuration); // Pause duration in milliseconds
    }

    wanderWithinBuilding(building) {
        const randomTarget = {
            top: building.position.top + Math.random() * building.position.height,
            left: building.position.left + Math.random() * building.position.width
        };
        this.setTarget(randomTarget);
    }

    randomWander() {
        const randomTarget = {
            top: Math.random() * window._canvas.height,
            left: Math.random() * window._canvas.width
        };
        this.setTarget(randomTarget);
    }

    setLocationBasedOnSchedule(currentHour) {
        // Find the active schedule entry for the given hour
        const activeSchedule = this.schedule.find(schedule => {
            if (schedule.startHour < schedule.endHour) {
                return currentHour >= schedule.startHour && currentHour < schedule.endHour;
            } else {
                return currentHour >= schedule.startHour || currentHour < schedule.endHour;
            }
        });

        if (activeSchedule) {
            // If the NPC has a schedule for the current time
            if (this.currentLocation !== activeSchedule.locationId) {
                this.currentLocation = activeSchedule.locationId;

                // Set an initial random target inside the building
                const targetBuilding = window._buildings.find(building => building.id === activeSchedule.locationId);
                if (targetBuilding) {
                    this.wanderWithinBuilding(targetBuilding);
                }
            } else if (this.targetPositions.length === 0 && !this.isPaused) {
                // Wander inside the building after a pause
                const targetBuilding = window._buildings.find(building => building.id === activeSchedule.locationId);
                if (targetBuilding) {
                    this.startPause(() => this.wanderWithinBuilding(targetBuilding));
                }
            }
        } else {
            // If no schedule is set, wander randomly around the map
            if (this.targetPositions.length === 0 && !this.isPaused) {
                this.startPause(() => this.randomWander());
            }
        }
    }



    generatePath(
        start,
        target,
        obstacles,
        gridWidth = Math.ceil(window._canvas.width / 10),
        gridHeight = Math.ceil(window._canvas.height / 10),
        cellSize = 10
    ) {
        const grid = new PF.Grid(gridWidth, gridHeight);

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

        const startX = Math.floor((start.left + 5) / cellSize);
        const startY = Math.floor((start.top + 5) / cellSize);
        const targetX = Math.floor(target.left / cellSize);
        const targetY = Math.floor(target.top / cellSize);

        const finder = new PF.AStarFinder({
            allowDiagonal: true,
            dontCrossCorners: true
        });

        const path = finder.findPath(startX, startY, targetX, targetY, grid);

        if (path.length === 0) {
            console.error("No path found between start and target.");
            return [];
        }

        const waypoints = path.map(([x, y]) => ({
            left: x * cellSize + cellSize / 2 - 5, // Adjust for player's center
            top: y * cellSize + cellSize / 2 - 5, // Adjust for player's center
        }));

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

    drawGrid(params) {
        const {grid, path, start, target, cellSize} = params;
        const ctx = window._context;

        const canvasWidth = window._canvas.width;
        const canvasHeight = window._canvas.height;

        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.lineDashOffset = this.lineDashOffset;
        ctx.beginPath();

        path.forEach(([x, y], index) => {
            if (index > this.targetIndex - 1) {
                const centerX = x * cellSize + cellSize / 2;
                const centerY = y * cellSize + cellSize / 2;

                if (index === 0) {
                    ctx.moveTo(centerX, centerY);
                } else {
                    ctx.lineTo(centerX, centerY);
                }
            }
        });

        ctx.stroke();
        ctx.setLineDash([]);

        const targetX = Math.floor(target.left / cellSize);
        const targetY = Math.floor(target.top / cellSize);
        ctx.fillStyle = this.color;
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

        if (Math.abs(deltaX) > 0) newPosition.left += Math.sign(deltaX) * this.speed;
        if (Math.abs(deltaY) > 0) newPosition.top += Math.sign(deltaY) * this.speed;
        newPosition.top = Math.floor(newPosition.top);
        newPosition.left = Math.floor(newPosition.left);

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

    setTarget(newTarget) {
        this.targetIndex = 0;
        this.targetPositions = this.generatePath(this.position, newTarget, window._obstacles);
    }

    render(context) {
        const {top, left, width, height} = this.position;
        context.fillStyle = this.color;
        context.beginPath();
        context.fillRect(left, top, width, height);
        context.fill();
        context.fillStyle = 'black';
        context.fillText(this.name, left - width, top - height);
        if (this.drawGridValues && this.id === 'Player') {
            this.lineDashOffset -= 1;
            if (this.lineDashOffset < -20) this.lineDashOffset = 0;
            this.drawGrid(this.drawGridValues);
        }
        if (this.id !== 'Player') {
            window._buildings.forEach(building => {
                building.isAtDoor(this);
            });
        }
    }
}

