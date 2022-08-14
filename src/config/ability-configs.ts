import { CharacterStatType } from "../character/character-types"

export interface AbilityEffect {
    type: "hp-minus" | "hp-plus"
    power: number
    stat: CharacterStatType
}

export interface AbilityConfig {
    id: string
    name: string
    isOffensive: boolean
    description: string
    effects: AbilityEffect[]
}

export const AbilityConfigs: Record<string, AbilityConfig> = {
    attack: {
        id: "attack",
        name: "Attack",
        isOffensive: true,
        description: "Attack an opponent, causing %0 <semibold>physical</semibold> damage.",
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
        description: "Attack an opponent, causing %0 <semibold>physical</semibold> damage.",
        effects: [
            {
                type: "hp-minus",
                power: 2,
                stat: "attack",
            },
        ],
    },
    heal: {
        id: "heal",
        name: "Heal",
        isOffensive: false,
        description: "Restore %0 health to an ally.",
        effects: [
            {
                type: "hp-plus",
                power: 1,
                stat: "healing",
            },
        ],
    },
}
