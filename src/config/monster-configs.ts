import { Ability } from "../abilities/ability-type"
import { AbilityId } from "./ability-configs"
import { ItemId } from "./item-configs"

export type MonsterId = "boar"

interface AIOption {
    abilityId: AbilityId
    chance: number
}

interface MonsterConfig {
    name: string
    level: number
    health: number
    energy: number
    speed: number
    firePower: number
    waterPower: number
    earthPower: number
    airPower: number
    fireResistance: number
    waterResistance: number
    earthResistance: number
    airResistance: number
    xp: number
    gold: number
    abilities: Record<AbilityId, Ability>
    ai: AIOption[]
    loot: {
        id: ItemId
        amountMin: number
        amountMax: number
        chance: number
    }[]
}

export const MonsterConfigs: Record<MonsterId, MonsterConfig> = {
    boar: {
        name: "Boar",
        level: 1,
        health: 10,
        energy: 2,
        firePower: 5,
        waterPower: 5,
        earthPower: 5,
        airPower: 5,
        fireResistance: 0,
        waterResistance: 0,
        earthResistance: 0,
        airResistance: 0,
        speed: 1,
        xp: 345,
        gold: 15,
        abilities: {
            fire_attack: {
                id: "fire_attack",
                rank: 1,
            },
        },
        ai: [
            {
                abilityId: "fire_attack",
                chance: 100,
            },
        ],
        loot: [
            {
                id: "maple_log",
                amountMin: 2,
                amountMax: 10,
                chance: 100,
            },
            {
                id: "maple_log",
                amountMin: 2,
                amountMax: 10,
                chance: 100,
            },
            {
                id: "leather_clothing",
                amountMin: 1,
                amountMax: 1,
                chance: 100,
            },
        ],
    },
}
