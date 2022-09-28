import { AbilityEffect } from "../abilities/ability-type"

export type AbilityId = "attack" | "bash" | "heal" | "magnum_break" | "sword_mastery" | "axe_mastery" | "berserk"

export type AbilityType = "instant" | "passive"

interface BasicAbilityConfig {
    id: AbilityId
    description: string
    effects: AbilityEffect[]
}

export interface InstantAbilityConfig extends BasicAbilityConfig {
    type: "instant"
    energy: number
    cooldown: number
    isOffensive: boolean
    isAoE: boolean
}

interface PassiveAbilityConfig extends BasicAbilityConfig {
    type: "passive"
}

export type AbilityConfig = InstantAbilityConfig | PassiveAbilityConfig

export const AbilityConfigs: Record<AbilityId, AbilityConfig> = {
    attack: {
        id: "attack",
        type: "instant",
        energy: 0,
        cooldown: 0,
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
        energy: 1,
        cooldown: 0,
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
        energy: 8,
        cooldown: 0,
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
        energy: 15,
        cooldown: 0,
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
    sword_mastery: {
        id: "sword_mastery",
        type: "passive",
        description: "Increase damage with swords.",
        effects: [
            {
                type: "stat-plus",
                power: 1,
                stat: "attack",
            },
        ],
    },
    axe_mastery: {
        id: "axe_mastery",
        type: "passive",
        description: "Increase damage with axes.",
        effects: [
            {
                type: "stat-plus",
                power: 1,
                stat: "attack",
            },
        ],
    },
    berserk: {
        id: "berserk",
        type: "instant",
        description: "Increase damage with axes.",
        energy: 4,
        cooldown: 1,
        isAoE: false,
        isOffensive: false,
        effects: [
            {
                type: "stat-plus",
                power: 1,
                stat: "attack",
            },
        ],
    },
}
