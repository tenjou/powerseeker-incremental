import { CharacterStatType } from "../character/character-types"

export type ItemId = "gold" | "carp" | "copper_ore" | "maple_log" | "leather_clothing" | "health_potion" | "axe" | "sword"

export type EquipmentSlot = "body" | "main_hand"

export type EquipmentType = "armor" | "axe" | "sword"

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

interface ItemConfigEquipment extends ItemConfigBasic {
    id: ItemId
    type: "equipment"
    slot: EquipmentSlot
    equipmentType: EquipmentType
    stats: ItemStat[]
}

interface ItemConfigConsumable extends ItemConfigBasic {
    id: ItemId
    type: "consumable"
    effects: ItemEffect[]
}

export type ItemConfig = ItemConfigResource | ItemConfigCurrency | ItemConfigEquipment | ItemConfigConsumable

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
        type: "equipment",
        slot: "body",
        equipmentType: "armor",
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
    axe: {
        id: "axe",
        type: "equipment",
        slot: "main_hand",
        equipmentType: "axe",
        stats: [{ type: "attack", value: 4 }],
    },
    sword: {
        id: "sword",
        type: "equipment",
        slot: "main_hand",
        equipmentType: "sword",
        stats: [{ type: "attack", value: 2 }],
    },
}
