import { ItemId, ItemStatType } from "../config/item-configs"

export interface ItemStat {
    type: ItemStatType
    value: number
}

export interface Item {
    uid: string
    id: ItemId
    level: number
    power: number
    rarity: number
    amount: number
    stats: ItemStat[]
}

export enum ItemSlotType {
    Inventory = "inventory",
    Equipment = "equipment",
    BattleResult = "battle-result",
}
