import Sensor from "./sensor.js";

export function createSensor(sensor) {
    sensor.id = sensor.id || Math.random().toString(36).substr(2, 8);
    const _sensor = new Sensor(sensor);
    window._sensors.push(_sensor);
    return _sensor;
}

export function removeSensor(sensor) {
    window._sensors = window._sensors.filter(o => o.id !== sensor.id);
}

export function createSensors(sensors) {
    for (let sensor of sensors) {
        createSensor(sensor);
    }
}

export function removeSensors(sensors) {
    for (let sensor of sensors) {
        removeSensor(sensor);
    }
}