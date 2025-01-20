import {InventoryItem, NPC, Building} from './interfaces/NPC'

export const Items: Array<InventoryItem> = [
    {
        id: 'CHOCOLATE_BAR',
        name: `Chocolate Bar`,
        category: 'Consumable',
        value: 1.20
    },
    {
        id: 'JESSIE_KEYCARD',
        opens: 'JESSIE_HOME',
        name: `Jessie's Home Keycard`,
        category: 'Key',
        value: 0
    },
    {
        id: 'STEVE_KEYCARD',
        opens: 'STEVE_HOME',
        name: `Steve's Home Keycard`,
        category: 'Key',
        value: 0
    },
    {
        id: 'IAN_KEYCARD',
        opens: 'IAN_HOME',
        name: `Ian's Home Keycard`,
        category: 'Key',
        value: 0
    },
    {
        id: 'TODD_KEYCARD',
        opens: 'TODD_HOME',
        name: `Todd's Home Keycard`,
        category: 'Key',
        value: 0
    }
]

export const Buildings: Array<Building> = [
    {
        id: 'JESSIE_HOME',
        name: `Jessie's Home`,
        owner: 'JESSIE',
        width: 200,
        height: 200,
        frontDoorFacing: 'north',
        top: 100,
        left: 100
    },
    {
        id: 'TODD_HOME',
        name: `Todd's Home`,
        owner: 'TODD',
        width: 200,
        height: 200,
        frontDoorFacing: 'south',
        top: 350,
        left: 100
    },
    {
        id: 'STEVE_HOME',
        name: `Steve's Home`,
        owner: 'STEVE',
        width: 200,
        height: 200,
        frontDoorFacing: 'east',
        top: 600,
        left: 100
    },
    {
        id: 'IAN_HOME',
        name: `Ian's Home`,
        owner: 'IAN',
        width: 200,
        height: 400,
        frontDoorFacing: 'west',
        top: 100,
        left: 700
    },
    {
        id: 'PLAYER_HOME',
        name: `Your Home`,
        owner: 'PLAYER',
        width: 200,
        height: 200,
        frontDoorFacing: 'west',
        top: 600,
        left: 700
    }
]

export const NPCs: Array<NPC> = [
    {
        id: 'JESSIE',
        name: 'Jessie',
        health: 100,
        color: 'orange',
        position: {
            top: 500,
            left: 500
        },
        personality: {
            openness: 50,
            conscientiousness: 50,
            extraversion: 50,
            agreeableness: 50,
            neuroticism: 50
        },
        inventory: ['CHOCOLATE_BAR', 'JESSIE_KEYCARD']

    },
    {
        id: 'STEVE',
        name: 'Steve',
        health: 100,
        color: 'limegreen',
        position: {
            top: 500,
            left: 480
        },
        personality: {
            openness: 50,
            conscientiousness: 50,
            extraversion: 50,
            agreeableness: 50,
            neuroticism: 50
        },
        inventory: ['STEVE_KEYCARD']

    },
    {
        id: 'IAN',
        name: 'Ian',
        health: 100,
        color: 'Green',
        position: {
            top: 500,
            left: 510
        },
        personality: {
            openness: 50,
            conscientiousness: 50,
            extraversion: 50,
            agreeableness: 50,
            neuroticism: 50
        },
        inventory: ['IAN_KEYCARD']

    },
    {
        id: 'TODD',
        name: 'Todd',
        health: 100,
        color: 'blue',
        position: {
            top: 520,
            left: 500
        },
        personality: {
            openness: 50,
            conscientiousness: 50,
            extraversion: 50,
            agreeableness: 50,
            neuroticism: 50
        },
        inventory: ['TODD_KEYCARD']

    }
]

export const sentientBeings: Array<Array<object>> = [NPCs, [{id: 'Player'}]];
export const Collidables: Array<Array<object>> = [Buildings, NPCs, [{id: 'Player'}]];