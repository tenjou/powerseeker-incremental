import { AbilityEffect } from "../abilities/ability-type"

export type AbilityId = "attack" | "bash" | "heal" | "magnum_break" | "sword_mastery" | "axe_mastery" | "berserk" | "poison"

export type AbilityType = "instant" | "passive"

export enum AbilityFlag {
    Offensive = 1,
    AoE = 2,
    Self = 4,
}

interface BasicAbilityConfig {
    id: AbilityId
    description: string
    effects: AbilityEffect[]
}

export interface InstantAbilityConfig extends BasicAbilityConfig {
    type: "instant"
    flags: number
    energy: number
    cooldown: number
    duration: number
    durationEffects: AbilityEffect[]
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
        duration: 0,
        durationEffects: [],
        flags: AbilityFlag.Offensive,
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
        duration: 0,
        durationEffects: [],
        flags: AbilityFlag.Offensive,
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
        duration: 0,
        durationEffects: [],
        flags: 0,
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
        duration: 0,
        durationEffects: [],
        flags: AbilityFlag.Offensive | AbilityFlag.AoE,
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
        cooldown: 0,
        duration: 1,
        durationEffects: [
            {
                type: "stat-plus",
                power: 100,
                stat: "attack",
            },
        ],
        flags: AbilityFlag.Offensive | AbilityFlag.AoE,
        effects: [],
    },
    poison: {
        id: "poison",
        type: "instant",
        description: "Increase damage with axes.",
        energy: 4,
        cooldown: 0,
        duration: 2,
        durationEffects: [],
        flags: AbilityFlag.Offensive,
        effects: [],
        // effects: [
        //     {
        //         type: "hp-minus",
        //         power: 1,
        //         stat: "attack",
        //     },
        // ],
    },
}
