import { CharacterStatType } from "../character/character-types"

export type ItemId = "gold" | "carp" | "copper_ore" | "maple_log" | "leather_clothing" | "health_potion"

export type ArmorSlot = "body"

export type EffectType = "restore_hp"

export interface ItemEffect {
    type: EffectType
    value: number
}

export interface ItemStat {
    type: CharacterStatType
    value: number
}

interface ItemConfigBasic {
    id: ItemId
}

interface ItemConfigResource extends ItemConfigBasic {
    id: ItemId
    type: "resource"
}

interface ItemConfigCurrency extends ItemConfigBasic {
    id: ItemId
    type: "currency"
}

interface ItemConfigArmor extends ItemConfigBasic {
    id: ItemId
    type: "armor"
    slot: ArmorSlot
    stats: ItemStat[]
}

interface ItemConfigConsumable extends ItemConfigBasic {
    id: ItemId
    type: "consumable"
    effects: ItemEffect[]
}

export type ItemConfig = ItemConfigResource | ItemConfigCurrency | ItemConfigArmor | ItemConfigConsumable

export type ItemType = ItemConfig["type"]

export const ItemConfigs: Record<ItemId, ItemConfig> = {
    gold: {
        id: "gold",
        type: "currency",
    },
    copper_ore: {
        id: "copper_ore",
        type: "resource",
    },
    carp: {
        id: "carp",
        type: "resource",
    },
    maple_log: {
        id: "maple_log",
        type: "resource",
    },
    leather_clothing: {
        id: "leather_clothing",
        type: "armor",
        slot: "body",
        stats: [
            { type: "defense", value: 10 },
            { type: "accuracy", value: 2 },
        ],
    },
    health_potion: {
        id: "health_potion",
        type: "consumable",
        effects: [
            {
                type: "restore_hp",
                value: 5,
            },
        ],
    },
}
