import { ItemId } from "./item-configs"

export type MonsterId = "boar"

interface MonsterConfig {
    name: string
    level: number
    hp: number
    attack: number
    defense: number
    speed: number
    xp: number
    gold: number
    loot: {
        id: ItemId
        amountMin: number
        amountMax: number
        chance: number
    }[]
}

export const MonsterConfigs: Record<MonsterId, MonsterConfig> = {
    boar: {
        name: "Boar",
        level: 1,
        hp: 10,
        attack: 2,
        defense: 1,
        speed: 1,
        xp: 345,
        gold: 15,
        loot: [
            {
                id: "maple_log",
                amountMin: 2,
                amountMax: 10,
                chance: 100,
            },
            {
                id: "maple_log",
                amountMin: 2,
                amountMax: 10,
                chance: 100,
            },
            {
                id: "leather_clothing",
                amountMin: 1,
                amountMax: 1,
                chance: 100,
            },
        ],
    },
}
