import { AbilityEffect, ElementType } from "../abilities/ability-type"

// export type AbilityId = "attack" | "bash" | "heal" | "magnum_break" | "sword_mastery" | "axe_mastery" | "berserk" | "poison"
export type AbilityId = "fire_attack"

export type AbilityType = "instant" | "passive"

export enum AbilityFlag {
    Offensive = 1,
    AoE = 2,
    Self = 4,
    Missable = 8,
    ExpiresAfterAction = 16,
}

interface BasicAbilityConfig {
    id: AbilityId
    description: string
    effects: AbilityEffect[]
}

export interface InstantAbilityConfig extends BasicAbilityConfig {
    type: "instant"
    element: ElementType
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
    fire_attack: {
        id: "fire_attack",
        type: "instant",
        element: "fire",
        energy: 0,
        cooldown: 0,
        duration: 0,
        durationEffects: [],
        flags: AbilityFlag.Offensive | AbilityFlag.Missable,
        description: "Attack an opponent, causing %0 <semibold>fire</semibold> damage.",
        effects: [
            {
                type: "health",
                power: -1,
                stat: "firePower",
            },
        ],
    },
    // bash: {
    //     id: "bash",
    //     type: "instant",
    //     element: "fire",
    //     energy: 1,
    //     cooldown: 0,
    //     duration: 0,
    //     durationEffects: [],
    //     flags: AbilityFlag.Offensive | AbilityFlag.Missable,
    //     description: "Attack an opponent, causing %0 <semibold>physical</semibold> damage.",
    //     effects: [
    //         {
    //             type: "health",
    //             power: -2,
    //         },
    //     ],
    // },
    // heal: {
    //     id: "heal",
    //     type: "instant",
    //     element: "water",
    //     energy: 8,
    //     cooldown: 0,
    //     duration: 0,
    //     durationEffects: [],
    //     flags: 0,
    //     description: "Restore %0 health to an ally.",
    //     effects: [
    //         {
    //             type: "health",
    //             power: 1,
    //         },
    //     ],
    // },
    // magnum_break: {
    //     id: "magnum_break",
    //     type: "instant",
    //     element: "fire",
    //     energy: 15,
    //     cooldown: 0,
    //     duration: 0,
    //     durationEffects: [],
    //     flags: AbilityFlag.Offensive | AbilityFlag.AoE,
    //     description: "Attack all opponents",
    //     effects: [
    //         {
    //             type: "health",
    //             power: -1,
    //         },
    //     ],
    // },
    // sword_mastery: {
    //     id: "sword_mastery",
    //     type: "passive",
    //     description: "Increase damage with swords.",
    //     effects: [
    //         {
    //             type: "stat",
    //             power: 1,
    //         },
    //     ],
    // },
    // axe_mastery: {
    //     id: "axe_mastery",
    //     type: "passive",
    //     description: "Increase damage with axes.",
    //     effects: [
    //         {
    //             type: "stat",
    //             power: 1,
    //         },
    //     ],
    // },
    // berserk: {
    //     id: "berserk",
    //     type: "instant",
    //     element: "fire",
    //     description: "Increase damage with axes.",
    //     energy: 2,
    //     cooldown: 1,
    //     duration: 2,
    //     durationEffects: [
    //         {
    //             type: "stat",
    //             power: 100,
    //         },
    //     ],
    //     flags: AbilityFlag.AoE | AbilityFlag.ExpiresAfterAction,
    //     effects: [],
    // },
    // poison: {
    //     id: "poison",
    //     type: "instant",
    //     element: "air",
    //     description: "Increase damage with axes.",
    //     energy: 4,
    //     cooldown: 0,
    //     duration: 2,
    //     durationEffects: [
    //         // {
    //         //     type: "stat",
    //         //     power: -2,
    //         //     stat: "regenHealth",
    //         // },
    //     ],
    //     flags: AbilityFlag.Offensive,
    //     effects: [
    //         // {
    //         //     type: "health",
    //         //     power: -1,
    //         //     stat: "attack",
    //         // },
    //     ],
    // },
}
