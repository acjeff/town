import {createObstacles, removeObstacles} from "./obstacleService.js";
import {createSensor, removeSensor} from "./sensorService.js";
import {createInteractionOption, removeInteractionOptions} from "./InteractionOptionService.js";
import {Inventory} from "./data.js";

export default class Building {
    constructor({id, name, owner, keyId, width, height, frontDoorFacing, position, locked = true, doorOpen = false}) {
        this.id = id;
        this.name = name;
        this.owner = owner;
        this.keyId = keyId;
        this.width = width;
        this.height = height;
        this.frontDoorFacing = frontDoorFacing;
        this.position = position;
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
            height: this.height - (ffd === 'west' && !closed ? this.doorSize : 0)
        };
        const topWall = {
            id: this.id + '_top_wall',
            left: this.position.left,
            top: this.position.top,
            width: this.width - (ffd === 'north' && !closed ? this.doorSize : 0),
            height: this.wallThickness
        };
        const rightWall = {
            id: this.id + '_right_wall',
            left: this.position.left + this.width - this.wallThickness,
            top: this.position.top,
            width: this.wallThickness,
            height: this.height - (ffd === 'east' && !closed ? this.doorSize : 0)
        };
        const bottomWall = {
            id: this.id + '_bottom_wall',
            left: this.position.left,
            top: this.position.top + this.height,
            width: this.width - (ffd === 'south' && !closed ? this.doorSize : 0),
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

        // Render building name
        context.fillStyle = 'black';
        context.fillText(this.name, this.position.left + 5, this.position.top - 10);
        this.isAtDoor();
    }

    // Check if the player is at the door
    isAtDoor() {
        let isColliding = false;
        let interactionOptionsForBuilding = window._interactionOptions.filter(io => io.id.includes(this.id));
        removeInteractionOptions(interactionOptionsForBuilding);
        if (this.sensor && this.sensor.isColliding(window._player, this.sensor)) {
            isColliding = true;
            if (this.locked && Inventory.find(i => i === this.keyId)) {
                // console.log('Locked and has key');
                createInteractionOption({
                    id: this.id + '_unlock_door',
                    label: 'Unlock door',
                    callback: () => this.locked = false
                })
            }
            if (this.locked && !Inventory.find(i => i === this.keyId)) {
                createInteractionOption({
                    id: this.id + '_key_required',
                    label: `Key missing for ${this.name}`,
                    callback: () => {},
                    disabled: true
                })
            }
            if (!this.locked) {
                if (!this.doorOpen) {
                    // console.log('Unlocked and door closed');
                    createInteractionOption({
                        id: this.id + '_open_door',
                        label: 'Open door',
                        callback: () => this.doorOpen = true
                    })
                    if (Inventory.find(i => i === this.keyId)) {
                        createInteractionOption({
                            id: this.id + '_lock_door',
                            label: 'Lock door',
                            callback: () => {
                                this.locked = true;
                            }
                        })
                    }
                } else {
                    // console.log('Unlocked and door open');
                    createInteractionOption({
                        id: this.id + '_close_door',
                        label: 'Close door',
                        callback: () => this.doorOpen = false
                    })
                }
            }
        }
        return isColliding;
    }
}

