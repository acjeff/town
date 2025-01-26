import InteractionOption from "./interactionOption.js";

export function createInteractionOption(interactionOption) {
    removeInteractionOption(interactionOption);
    interactionOption.id = interactionOption.id || Math.random().toString(36).substr(2, 8);
    const _interactionOption = new InteractionOption(interactionOption);
    window._interactionOptions.push(_interactionOption);
}

export function removeInteractionOption(interactionOption) {
    window._interactionOptions = window._interactionOptions.filter(o => o.id !== interactionOption.id);
}

export function createInteractionOptions(interactionOptions) {
    for (let interactionOption of interactionOptions) {
        createInteractionOption(interactionOption);
    }
}

export function removeInteractionOptions(interactionOptions) {
    for (let interactionOption of interactionOptions) {
        removeInteractionOption(interactionOption);
    }
}