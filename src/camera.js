export default class Camera {
    constructor(canvas, player) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.player = player;
        this.offsetX = 0;
        this.offsetY = 0;
    }

    update() {
        // Center the camera on the player
        this.offsetX = this.player.position.left - window.innerWidth / 2;
        this.offsetY = this.player.position.top - window.innerHeight / 2;
    }

    draw(entity) {
        // Adjust entity position based on the camera offset
        if (entity.render) {
            this.context.save();
            this.context.translate(-this.offsetX, -this.offsetY);
            entity.render(this.context);
            this.context.restore();
        }
    }
}