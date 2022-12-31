import { ItemId } from "../config/item-configs"

export type ItemStatType = "attack" | "healing" | "defense"

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
