import {createObstacle, createObstacles, removeObstacles} from "./obstacleService.js";
import {createSensor, removeSensor} from "./sensorService.js";
import {createInteractionOption, removeInteractionOptions} from "./InteractionOptionService.js";
import {Inventory} from "./data.js";

export default class Building {
    constructor({id, name, owner, keyId, frontDoorFacing, position, locked = true, doorOpen = false}) {
        this.id = id;
        this.name = name;
        this.owner = owner;
        this.keyId = keyId;
        this.frontDoorFacing = frontDoorFacing;
        this.position = position;
        this.width = position.width;
        this.height = position.height;
        this.locked = locked;
        this.doorOpen = doorOpen;
        this.doorSize = 50;
        this.wallThickness = 10;
    }

    render(context) {
        // Render outer walls
        const ffd = this.frontDoorFacing;
        let closed = this.locked ? true : (!this.doorOpen);
        context.fillStyle = 'black';
        const leftWall = {
            id: this.id + '_left_wall',
            left: this.position.left,
            top: this.position.top,
            width: this.wallThickness,
            height: this.height - (ffd === 'west' ? this.doorSize : 0)
        };
        const topWall = {
            id: this.id + '_top_wall',
            left: this.position.left,
            top: this.position.top,
            width: this.width - (ffd === 'north' ? this.doorSize : 0),
            height: this.wallThickness
        };
        const rightWall = {
            id: this.id + '_right_wall',
            left: this.position.left + this.width - this.wallThickness,
            top: this.position.top,
            width: this.wallThickness,
            height: this.height - (ffd === 'east'  ? this.doorSize : 0)
        };
        const bottomWall = {
            id: this.id + '_bottom_wall',
            left: this.position.left,
            top: this.position.top + this.height,
            width: this.width - (ffd === 'south'  ? this.doorSize : 0),
            height: this.wallThickness
        };
        context.fillRect(leftWall.left, leftWall.top, leftWall.width, leftWall.height);
        context.fillRect(topWall.left, topWall.top, topWall.width, topWall.height);
        context.fillRect(rightWall.left, rightWall.top, rightWall.width, rightWall.height);
        context.fillRect(bottomWall.left, bottomWall.top, bottomWall.width, bottomWall.height);
        removeObstacles([leftWall, topWall, rightWall, bottomWall]);
        createObstacles([leftWall, topWall, rightWall, bottomWall]);

        // Render door
        let doorSensor = {
            id: this.id + '_front_door_sensor',
            width: this.doorSize,
            height: this.doorSize,
            func: this.interact
        };
        let door = {};
        switch (this.frontDoorFacing) {
            case 'north':
                doorSensor.top = this.position.top - this.doorSize / 2;
                doorSensor.left = this.position.left + this.width - this.wallThickness - this.doorSize;
                door = topWall;
                door.width = this.doorSize;
                if (this.doorOpen) door.left = door.left + this.width - this.doorSize * 2;
                else door.left = door.left + this.width - this.doorSize;
                break;
            case 'south':
                doorSensor.top = this.position.top + this.height - this.doorSize / 2;
                doorSensor.left = this.position.left + this.width - this.wallThickness - this.doorSize;
                door = bottomWall;
                door.width = this.doorSize;
                if (this.doorOpen) door.left = door.left + this.width - this.doorSize * 2;
                else door.left = door.left + this.width - this.doorSize;
                break;
            case 'east':
                doorSensor.top = this.position.top + this.height - this.doorSize;
                doorSensor.left = this.position.left + this.width - this.doorSize / 2;
                door = rightWall;
                door.height = this.doorSize;
                if (this.doorOpen) door.top = door.top + this.height - this.doorSize * 2;
                else door.top = door.top + this.height - this.doorSize;
                break;
            case 'west':
                doorSensor.top = this.position.top + this.height - this.doorSize;
                doorSensor.left = this.position.left - this.doorSize / 2;
                door = leftWall;
                door.height = this.doorSize;
                if (this.doorOpen) door.top = door.top + this.height - this.doorSize * 2;
                else door.top = door.top + this.height - this.doorSize;
                break;
        }
        removeSensor(doorSensor)
        this.sensor = createSensor(doorSensor);
        context.fillStyle = 'transparent'
        context.fillRect(doorSensor.left, doorSensor.top, doorSensor.width, doorSensor.height);
        context.fillStyle = 'brown';
        context.fillRect(door.left, door.top, door.width, door.height);
        createObstacle({id: this.id + '_door', left: door.left, top: door.top, width: door.width, height: door.height});

        // Render building name
        context.fillStyle = 'black';
        context.fillText(this.name, this.position.left + 5, this.position.top - 10);
        this.isAtDoor();
    }

    // Check if the player is at the door
    isAtDoor(entity) {
        let isColliding = false;
        if (!entity) {
            let interactionOptionsForBuilding = window._interactionOptions.filter(io => io.id.includes(this.id));
            removeInteractionOptions(interactionOptionsForBuilding);
        }
        if (this.sensor && this.sensor.isColliding(entity || window._player, this.sensor)) {
            const inventory = entity ? entity.inventory : Inventory;
            isColliding = true;
            if (this.locked && inventory.find(i => i === this.keyId)) {
                // console.log('Locked and has key');
                if (!entity) {
                    createInteractionOption({
                        id: this.id + '_unlock_door',
                        label: 'Unlock door',
                        callback: () => this.locked = false,
                        width: 200
                    })
                } else {
                    this.locked = false;
                    this.doorOpen = true;
                }
            }
            if (this.locked && !inventory.find(i => i === this.keyId)) {
                if (!entity) {
                    createInteractionOption({
                        id: this.id + '_key_required',
                        label: `Key missing for ${this.name}`,
                        callback: () => {
                        },
                        disabled: true
                    })
                }
            }
            if (!this.locked) {
                if (!this.doorOpen) {
                    // console.log('Unlocked and door closed');
                    if (!entity) {
                        createInteractionOption({
                            id: this.id + '_open_door',
                            label: 'Open door',
                            callback: () => this.doorOpen = true,
                            width: 200
                        })
                    } else {
                        this.doorOpen = true;
                    }
                    if (inventory.find(i => i === this.keyId)) {
                        if (!entity) {
                            createInteractionOption({
                                id: this.id + '_lock_door',
                                label: 'Lock door',
                                callback: () => {
                                    this.locked = true;
                                },
                                width: 200
                            })
                        }
                    }
                } else {
                    // console.log('Unlocked and door open');
                    if (!entity) {
                        createInteractionOption({
                            id: this.id + '_close_door',
                            label: 'Close door',
                            callback: () => this.doorOpen = false,
                            width: 200
                        })
                    }
                }
            }
        }
        return isColliding;
    }
}

