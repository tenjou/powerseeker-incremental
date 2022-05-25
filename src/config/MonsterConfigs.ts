export type MonsterId = "boar"

interface MonsterConfig {
    name: string
    level: number
    hp: number
    power: number
    defense: number
    speed: number
}

export const MonsterConfigs: Record<MonsterId, MonsterConfig> = {
    boar: {
        name: "Boar",
        level: 1,
        hp: 10,
        power: 2,
        defense: 1,
        speed: 1,
    },
}
