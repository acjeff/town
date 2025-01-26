export default class Camera {
    constructor(canvas, player) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.player = player;
        this.offsetX = 0;
        this.offsetY = 0;
        this.zoom = 1; // Initial zoom level
        this.zoomSpeed = 0.1; // Speed of zooming
        this.minZoom = 0.5; // Minimum zoom level
        this.maxZoom = 2.0; // Maximum zoom level
        this.edgeThreshold = 100; // Distance from edge to trigger camera movement
        this.cameraSpeed = 5; // Speed of camera movement with arrow keys
        this.keys = {};

        // Add event listeners for mouse scroll and arrow keys
        window.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
        });
        window.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
        canvas.addEventListener('wheel', (e) => this.handleZoom(e));
    }

    handleZoom(event) {
        event.preventDefault(); // Prevent the page from scrolling
        const delta = event.deltaY > 0 ? -1 : 1; // Determine scroll direction
        const oldZoom = this.zoom;
        this.zoom += delta * this.zoomSpeed;
        this.zoom = Math.min(Math.max(this.zoom, this.minZoom), this.maxZoom); // Clamp zoom level

        // Adjust offsets to zoom towards the mouse position
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = (event.clientX - rect.left) / oldZoom + this.offsetX;
        const mouseY = (event.clientY - rect.top) / oldZoom + this.offsetY;

        this.offsetX = mouseX - (event.clientX - rect.left) / this.zoom;
        this.offsetY = mouseY - (event.clientY - rect.top) / this.zoom;
    }

    worldToScreen(x, y) {
        // Convert world coordinates to screen coordinates
        return {
            left: (x - this.offsetX) * this.zoom,
            top: (y - this.offsetY) * this.zoom
        };
    }

    screenToWorld(x, y) {
        // Convert screen coordinates to world coordinates
        return {
            left: x / this.zoom + this.offsetX,
            top: y / this.zoom + this.offsetY
        };
    }

    update() {
        const playerX = this.player.position.left;
        const playerY = this.player.position.top;

        // Get window center and edges adjusted for zoom
        const leftEdge = this.offsetX + this.edgeThreshold / this.zoom;
        const rightEdge = this.offsetX + (window.innerWidth - this.edgeThreshold) / this.zoom;
        const topEdge = this.offsetY + this.edgeThreshold / this.zoom;
        const bottomEdge = this.offsetY + (window.innerHeight - this.edgeThreshold) / this.zoom;

        // Adjust camera to keep the player within the visible area
        if (playerX < leftEdge) this.offsetX -= Math.floor(leftEdge - playerX);
        if (playerX > rightEdge) this.offsetX += Math.floor(playerX - rightEdge);
        if (playerY < topEdge) this.offsetY -= Math.floor(topEdge - playerY);
        if (playerY > bottomEdge) this.offsetY += Math.floor(playerY - bottomEdge);

        // Camera movement with arrow keys
        if (this.keys['ArrowLeft']) this.offsetX -= this.cameraSpeed / this.zoom;
        if (this.keys['ArrowRight']) this.offsetX += this.cameraSpeed / this.zoom;
        if (this.keys['ArrowUp']) this.offsetY -= this.cameraSpeed / this.zoom;
        if (this.keys['ArrowDown']) this.offsetY += this.cameraSpeed / this.zoom;

        // Ensure offsets are integers
        this.offsetX = Math.round(this.offsetX);
        this.offsetY = Math.round(this.offsetY);
    }
}