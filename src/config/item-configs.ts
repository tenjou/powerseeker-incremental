import { CharacterStatType } from "../character/character-types"

export type ItemId = "carp" | "copper_ore" | "maple_log" | "leather_clothing" | "health_potion"

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
    description: string
}

interface ItemConfigResource extends ItemConfigBasic {
    id: ItemId
    type: "resource"
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

export type ItemConfig = ItemConfigResource | ItemConfigArmor | ItemConfigConsumable

export type ItemType = ItemConfig["type"]

export const ItemConfigs: Record<ItemId, ItemConfig> = {
    copper_ore: {
        id: "copper_ore",
        type: "resource",
        description: "",
    },
    carp: {
        id: "carp",
        type: "resource",
        description: "",
    },
    maple_log: {
        id: "maple_log",
        type: "resource",
        description: "",
    },
    leather_clothing: {
        id: "leather_clothing",
        type: "armor",
        description: "",
        slot: "body",
        stats: [
            { type: "defense", value: 10 },
            { type: "accuracy", value: 2 },
        ],
    },
    health_potion: {
        id: "health_potion",
        type: "consumable",
        description: "Restore %0 <semibold>health</semibold>.",
        effects: [
            {
                type: "restore_hp",
                value: 5,
            },
        ],
    },
}
