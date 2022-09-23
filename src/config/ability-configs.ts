import { AbilityType, AbilityEffect } from "../abilities/ability-type"

export type AbilityId = "attack" | "bash" | "heal" | "magnum_break"

export interface AbilityConfig {
    id: AbilityId
    type: AbilityType
    isOffensive: boolean
    isAoE: boolean
    description: string
    effects: AbilityEffect[]
}

export const AbilityConfigs: Record<AbilityId, AbilityConfig> = {
    attack: {
        id: "attack",
        type: "instant",
        isOffensive: true,
        isAoE: false,
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
        isAoE: false,
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
        isAoE: false,
        description: "Restore %0 health to an ally.",
        effects: [
            {
                type: "hp-plus",
                power: 1,
                stat: "healing",
            },
        ],
    },
    magnum_break: {
        id: "magnum_break",
        type: "instant",
        isOffensive: true,
        isAoE: true,
        description: "Attack all opponents",
        effects: [
            {
                type: "hp-minus",
                power: 1,
                stat: "attack",
            },
        ],
    },
}
