import {createObstacles, removeObstacles} from "./obstacleService.js";
import {createSensor, removeSensor} from "./sensorService.js";

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
        // Bind interact to ensure `this` refers to the Building instance
        this.interact = this.interact.bind(this);
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
    }

    // Check if the player is at the door
    isAtDoor(entity) {
        let isColliding = false;
        if (this.sensor && this.sensor.isColliding(entity, this.sensor)) {
            isColliding = true;
        }
        return isColliding;
    }

    // Interact with the door
    interact() {
        console.log('Interact');
        this.doorOpen = !this.doorOpen;
        // if (this.locked) {
        //     if (window._player.inventory.includes(this.keyId)) {
        //         this.locked = false;
        //         console.log(`You unlocked ${this.name}!`);
        //     } else {
        //         console.log(`${this.name} is locked, and you don't have the key.`);
        //     }
        // } else {
        //     this.doorOpen = !this.doorOpen;
        //     console.log(`${this.name} door is now ${this.doorOpen ? 'open' : 'closed'}.`);
        // }
    }
}

