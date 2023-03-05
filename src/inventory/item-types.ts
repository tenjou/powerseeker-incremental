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
    amount: number
    rarity: number
    stats: ItemStat[]
}
