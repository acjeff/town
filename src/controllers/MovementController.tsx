import {NPC} from "../interfaces/NPC.tsx";
import {Collidables} from "../Data.tsx";

const elementsFromPointInContainer = function (container: Element, x: number, y: number) {
    if (!(container instanceof HTMLElement)) {
        throw new Error("Provided container is not a valid HTMLElement.");
    }

    // Get container's bounding rectangle
    const rect = container.getBoundingClientRect();

    // Calculate the point's position relative to the viewport
    const viewportX = rect.left + x;
    const viewportY = rect.top + y;

    // Use document.elementsFromPoint with the adjusted coordinates
    return document.elementsFromPoint(viewportX, viewportY);
};

interface CalculateNewPositionParams {
    prevPosition: NPC["position"];
    direction: string;
    walkSpeed: number;
    characterWidth: number;
    idToMove: string;
    callback?: (newPosition: string) => boolean;
}

export const calculateNewPosition = function ({
                                                  prevPosition,
                                                  direction,
                                                  walkSpeed,
                                                  characterWidth,
                                                  idToMove,
                                                  callback
                                              }: CalculateNewPositionParams) {
    let {left, top} = prevPosition;
    let nextLeft = left;
    let nextTop = top;
    let collisions: Element[] = [];

    const TownContainer: Element | null = document.querySelector('#town');

    // Calculate the next position based on the direction
    switch (direction) {
        case 'up':
            nextTop -= walkSpeed;
            break;
        case 'down':
            nextTop += walkSpeed;
            break;
        case 'left':
            nextLeft -= walkSpeed;
            break;
        case 'right':
            nextLeft += walkSpeed;
            break;
    }

    if (TownContainer) {
        // Check if the next position will cause a collision with multiple elements
        const nextElements = elementsFromPointInContainer(
            TownContainer,
            nextLeft + characterWidth / 2,
            nextTop + characterWidth / 2
        );

        if (idToMove === 'Player') {
            console.log(nextElements, ': nextElements');
        }

        // Filter the elements to find collidables
        collisions = nextElements.filter((element) => {
            // Ignore the current NPC itself
            if (idToMove === element.id) return false;

            // Check if the element is in Collidables
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            return Collidables.flat().some((collidable: { id: string }) => {
                const isSensorPresent = nextElements.some((e: { id: string }) => e.id.includes('SENSOR'));

                if (idToMove === 'Player') {
                    console.log({
                        isSensorPresent,
                        elementId: element.id,
                        collidableId: collidable.id,
                        collidingWithDoor: nextElements.some((e: { id: string }) => e.id.includes('DOOR')),
                        generalCollision: element.id.includes(collidable.id)
                    });
                }

                // Condition 1: If a sensor is present, only allow collision with doors
                if (isSensorPresent) {
                    // Restrict to doors and ensure the element collides with the door specifically
                    return nextElements.some((e: { id: string }) => e.id.includes('DOOR')) && element.id.includes(collidable.id);
                }

                // Condition 2: Do not collide with sensors themselves
                if (element.id.includes('SENSOR')) {
                    return false;
                }

                // Condition 3: Otherwise, allow collision with anything in the collidables list
                return element.id.includes(collidable.id);
            });

        });
    }

    // Handle movement and collision
    if (collisions.length === 0) {
        // Update position if no collision
        left = nextLeft;
        top = nextTop;
    } else {
        if (callback) {
            console.log(`${idToMove} collided with`, collisions.map((el) => el.id));
            // Stop movement or reverse it
            switch (direction) {
                case 'up':
                    callback('down');
                    break;
                case 'down':
                    callback('up');
                    break;
                case 'left':
                    callback('right');
                    break;
                case 'right':
                    callback('left');
                    break;
            }
        }
    }

    // Ensure the NPC doesn't move out of bounds
    left = Math.max(0, Math.min(left, window._worldWidth - characterWidth));
    top = Math.max(0, Math.min(top, window._worldHeight - characterWidth));

    return {left, top};
};
