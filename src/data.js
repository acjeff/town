export const Items = [
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
    },
    {
        id: 'PLAYER_KEYCARD',
        opens: 'PLAYER_HOME',
        name: `Your Home Keycard`,
        category: 'Key',
        value: 0
    }
]
export const Buildings = [
    {
        id: 'JESSIE_HOME',
        name: `Jessie's Home`,
        owner: 'JESSIE',
        keyId: 'JESSIE_KEYCARD',
        frontDoorFacing: 'north',
        position: {
            top: 100,
            left: 100,
            width: 200,
            height: 200,
        }
    },
    {
        id: 'TODD_HOME',
        name: `Todd's Home`,
        owner: 'TODD',
        frontDoorFacing: 'south',
        position: {
            top: 350,
            left: 100,
            width: 200,
            height: 200,
        },
        keyId: 'TODD_KEYCARD'
    },
    {
        id: 'STEVE_HOME',
        name: `Steve's Home`,
        owner: 'STEVE',
        frontDoorFacing: 'east',
        position: {
            top: 600,
            left: 100,
            width: 200,
            height: 200
        },
        keyId: 'STEVE_KEYCARD'
    },
    {
        id: 'IAN_HOME',
        name: `Ian's Home`,
        owner: 'IAN',
        frontDoorFacing: 'west',
        position: {
            top: 100,
            left: 700,
            width: 200,
            height: 400
        },
        keyId: 'IAN_KEYCARD'
    },
    {
        id: 'PLAYER_HOME',
        name: `Your Home`,
        owner: 'PLAYER',
        frontDoorFacing: 'west',
        position: {
            top: 600,
            left: 700,
            width: 200,
            height: 200
        },
        keyId: 'PLAYER_KEYCARD',
        locked: false,
        doorOpen: true
    },
    {
        id: 'SUPER_MARKET',
        name: `Super market`,
        frontDoorFacing: 'west',
        position: {
            top: 100,
            left: 1200,
            width: 300,
            height: 800,
        },
        keyId: 'PLAYER_KEYCARD',
        locked: false,
        doorOpen: true
    }
]
export const NPCs = [
    {
        id: 'JESSIE',
        home: 'JESSIE_HOME',
        name: 'Jessie',
        health: 100,
        color: 'orange',
        position: {
            top: 505,
            left: 505,
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
        home: 'STEVE_HOME',
        name: 'Steve',
        health: 100,
        color: 'limegreen',
        position: {
            top: 515,
            left: 485,
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
        home: 'IAN_HOME',
        name: 'Ian',
        health: 100,
        color: 'lightpink',
        position: {
            top: 545,
            left: 515
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
        home: 'TODD_HOME',
        name: 'Todd',
        health: 100,
        color: 'purple',
        position: {
            top: 525,
            left: 505,
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
export const Inventory = ["PLAYER_KEYCARD", 'JESSIE_KEYCARD'];
export const sentientBeings = [NPCs, [{id: 'Player'}]];
export const Collidables = [Buildings, NPCs, [{id: 'Player'}]];
export const Everything = [Buildings, NPCs, Items, [{id: 'Player'}]];