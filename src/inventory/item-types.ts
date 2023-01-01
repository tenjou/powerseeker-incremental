import { ItemId } from "../config/item-configs"

export type ItemStatType = "attack" | "healing" | "defense" | "accuracy"

export interface ItemStat {
    type: ItemStatType
    value: number
}

export interface Item {
    uid: string
    id: ItemId
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
