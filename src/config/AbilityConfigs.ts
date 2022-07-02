import { CharacterStatType } from "../stats"

export interface AbilityEffect {
    type: "hp-minus" | "hp-plus"
    power: number
    stat: CharacterStatType
}

interface AbilityConfig {
    id: string
    name: string
    isOffensive: boolean
    tooltip: string
    effects: AbilityEffect[]
}

export const AbilityConfigs: Record<string, AbilityConfig> = {
    attack: {
        id: "attack",
        name: "Attack",
        isOffensive: true,
        tooltip: "Attack an opponent, causing %0 <semibold>physical</semibold> damage.",
        effects: [
            {
                type: "hp-minus",
                power: 1,
                stat: "attack",
            },
        ],
    },
    bash: {
        id: "bash",
        name: "Bash",
        isOffensive: true,
        tooltip: "Attack an opponent, causing %0 <semibold>physical</semibold> damage.",
        effects: [
            {
                type: "hp-minus",
                power: 4,
                stat: "attack",
            },
        ],
    },
    heal: {
        id: "heal",
        name: "Heal",
        isOffensive: false,
        tooltip: "Restore %0 health to an ally.",
        effects: [
            {
                type: "hp-plus",
                power: 1,
                stat: "healing",
            },
        ],
    },
}
