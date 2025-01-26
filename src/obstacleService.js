import Obstacle from "./obstacle.js";

export function createObstacle(obstacle) {
    removeObstacle(obstacle);
    obstacle.id = obstacle.id || Math.random().toString(36).substr(2, 8);
    const _obstacle = new Obstacle(obstacle);
    window._obstacles.push(_obstacle);
}

export function removeObstacle(obstacle) {
    window._obstacles = window._obstacles.filter(o => o.id !== obstacle.id);
}

export function createObstacles(obstacles) {
    for (let obstacle of obstacles) {
        createObstacle(obstacle);
    }
}

export function removeObstacles(obstacles) {
    for (let obstacle of obstacles) {
        removeObstacle(obstacle);
    }
}