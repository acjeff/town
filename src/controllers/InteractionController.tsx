import {NPC} from "../interfaces/NPC.tsx";

interface InteractionParams {
    position: NPC["position"];
    idInteracting: NPC["id"];
}

export const getInteractionOptions = function ({position, idInteracting}: InteractionParams) {
    return;
};