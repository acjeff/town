export interface InventoryItem {
    id: string,
    name: string,
    category: string,
    value: number,
    opens?: string
}

export interface Building {
    id: string,
    name: string,
    owner: string,
    width: number,
    height: number,
    frontDoorFacing: string,
    top: number,
    left: number,
    open?: boolean
}

export interface NPC {
    id: string,
    name: string,
    health: number,
    color: string,
    position: {
        top: number,
        left: number
    }
    personality: {
        openness: number,
        conscientiousness: number,
        extraversion: number,
        agreeableness: number,
        neuroticism: number
    },
    inventory: Array<InventoryItem["id"]>
}