export default class InteractionOption {
    constructor({id, callback, label, width = 200, height = 30, top, left, disabled = false}) {
        this.id = id;
        this.callback = callback;
        this.label = label;
        this.width = width;
        this.height = height;
        this.top = top;
        this.left = left;
        this.disabled = disabled;
    }

    onClick(player) {
        if (this.callback) this.callback({optionDetails: this, entity: player});
    }

}
