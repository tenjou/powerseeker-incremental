import { AbilityId, AbilityType, AbilityEffect } from "../abilities/ability-type"

export interface AbilityConfig {
    id: AbilityId
    type: AbilityType
    isOffensive: boolean
    description: string
    effects: AbilityEffect[]
}

export const AbilityConfigs: Record<AbilityId, AbilityConfig> = {
    attack: {
        id: "attack",
        type: "instant",
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
        type: "instant",
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
        type: "instant",
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
