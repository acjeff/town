export default class InputHandler {
    constructor() {
        this.keys = {};

        // Track key presses
        window.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
    }

    isKeyPressed(key) {
        return this.keys[key];
    }
}
