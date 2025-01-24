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
        this.offsetX = this.player.position.left - this.canvas.width / 2;
        this.offsetY = this.player.position.top - this.canvas.height / 2;
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