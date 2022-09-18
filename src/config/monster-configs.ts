export type MonsterId = "boar"

interface MonsterConfig {
    name: string
    level: number
    hp: number
    attack: number
    defense: number
    speed: number
    xp: number
    loot: {
        itemType: string
        amount: number
    }
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
        loot: {
            itemType: "mapple_log",
            amount: 10,
        },
    },
}
