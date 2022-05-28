export type ItemId = "carp" | "copper_ore" | "mapple_log" | "leather_clothing" | "health_potion"

export type ArmorSlot = "body"

export type EffectType = "restore_hp"

export interface ItemEffect {
    type: EffectType
    value: number
}

interface ItemConfigBasic {
    id: ItemId
    name: string
}

interface ItemConfigResource extends ItemConfigBasic {
    id: ItemId
    name: string
    type: "resource"
}

interface ItemConfigArmor extends ItemConfigBasic {
    id: ItemId
    name: string
    type: "armor"
    slot: ArmorSlot
    defense: number
}

interface ItemConfigConsumable extends ItemConfigBasic {
    id: ItemId
    name: string
    type: "consumable"
    effects: ItemEffect[]
}

type ItemConfig = ItemConfigResource | ItemConfigArmor | ItemConfigConsumable

export type ItemType = ItemConfig["type"]

export const ItemConfigs: Record<ItemId, ItemConfig> = {
    copper_ore: {
        id: "copper_ore",
        name: "Copper Ore",
        type: "resource",
    },
    carp: {
        id: "carp",
        name: "Carp",
        type: "resource",
    },
    mapple_log: {
        id: "mapple_log",
        name: "Mappleg Log",
        type: "resource",
    },
    leather_clothing: {
        id: "leather_clothing",
        name: "Leather Clothing",
        type: "armor",
        slot: "body",
        defense: 1,
    },
    health_potion: {
        id: "health_potion",
        name: "Health Potion",
        type: "consumable",
        effects: [
            {
                type: "restore_hp",
                value: 5,
            },
        ],
    },
}
