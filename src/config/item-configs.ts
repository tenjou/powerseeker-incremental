import { ItemStat } from "../inventory/item-types"

export type ItemId = "gold" | "carp" | "copper_ore" | "maple_log" | "leather_clothing" | "health_potion" | "axe" | "sword"

export type EquipmentSlot = "body" | "main_hand"

export type EquipmentType = "armor" | "axe" | "sword"

export type EffectType = "restore_hp"

export interface ItemEffect {
    type: EffectType
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

export interface ItemConfigEquipment extends ItemConfigBasic {
    id: ItemId
    type: "equipment"
    slot: EquipmentSlot
    equipmentType: EquipmentType
    level: number
    stats: ItemStatType[]
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
        level: 1,
        stats: ["defense", "accuracy"],
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
        level: 1,
        stats: ["attack"],
    },
    sword: {
        id: "sword",
        type: "equipment",
        slot: "main_hand",
        equipmentType: "sword",
        level: 1,
        stats: ["attack"],
    },
}

export interface ItemStatConfig {
    weight: number
}

export const ItemStatsConfig = {
    attack: {
        weight: 1,
    },
    healing: {
        weight: 1,
    },
    defense: {
        weight: 1,
    },
    accuracy: {
        weight: 1,
    },
    evasion: {
        weight: 1,
    },
    speed: {
        weight: 1,
    },
    health: {
        weight: 1,
    },
    mana: {
        weight: 1,
    },
    health_regen: {
        weight: 1,
    },
    mana_regen: {
        weight: 1,
    },
    aggro: {
        weight: 1,
    },
    increase_fire_damage: {
        weight: 1,
    },
    increase_water_damage: {
        weight: 1,
    },
    increase_earth_damage: {
        weight: 1,
    },
    increase_wind_damage: {
        weight: 1,
    },
} satisfies Record<string, ItemStatConfig>

export type ItemStatType = keyof typeof ItemStatsConfig

export const ItemStatTypes = Object.keys(ItemStatsConfig) as ItemStatType[]
