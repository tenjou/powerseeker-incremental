import { randomNumber } from "./../utils"
import { AbilityEffect } from "./../config/ability-configs"
import { CharacterStats } from "./../character/character-types"

export const getMaxPower = (stats: CharacterStats, effect: AbilityEffect) => {
    return (effect.power * stats[effect.stat]) | 0
}

export const getPower = (maxPower: number) => {
    const minPower = Math.max(1, (maxPower * 0.75) | 0)
    return randomNumber(minPower, maxPower)
}

export const calculatePower = (stats: CharacterStats, effect: AbilityEffect) => {
    const maxPower = getMaxPower(stats, effect)
    return getPower(maxPower)
}

export const getActionSpeed = (maxSpeed: number) => {
    const minSpeed = (maxSpeed * 0.75) | 0
    return randomNumber(minSpeed, maxSpeed)
}
