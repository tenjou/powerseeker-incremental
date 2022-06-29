import { CharacterStatType } from "../stats"

interface AbilityEffect {
    type: "hp-minus" | "hp-plus"
    power: number
    stat: CharacterStatType
}

interface AbilityConfig {
    id: string
    name: string
    effects: AbilityEffect[]
}

export const AbilityConfigs: Record<string, AbilityConfig> = {
    attack: {
        id: "attack",
        name: "Attack",
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
        effects: [
            {
                type: "hp-plus",
                power: 1,
                stat: "healing",
            },
        ],
    },
}
