export default class Sensor {
    constructor({id, top, left, width, height, func}) {
        this.id = id;
        this.left = left;
        this.top = top;
        this.width = width;
        this.height = height;
        this.func = func;
    }

    isColliding(rect1, rect2) {
        if (rect1.position) rect1 = rect1.position;
        if (rect2.position) rect2 = rect2.position;
        return (
            rect1.left < rect2.left + rect2.width &&
            rect1.left + rect1.width > rect2.left &&
            rect1.top < rect2.top + rect2.height &&
            rect1.top + rect1.height > rect2.top
        );
    }

    interact(player) {
        if (this.isColliding(player, this)) {
            if (this.func) this.func({sensor: this, entity: player});
        }
    }

}

