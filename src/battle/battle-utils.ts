import { randomNumber } from "./../utils"
import { CharacterStats } from "./../character/character-types"
import { AbilityEffect } from "../abilities/ability-type"
// import { getMaxPower } from "./../abilities/abilities-utils"

export const getPower = (srcMaxPower: number) => {
    const maxPower = Math.abs(srcMaxPower)
    const sign = srcMaxPower > 0 ? 1 : -1
    const minPower = Math.max(1, (maxPower * sign * 0.75) | 0)
    return randomNumber(minPower, maxPower) * sign
}

export const calculatePower = (stats: CharacterStats, effect: AbilityEffect) => {
    // const maxPower = getMaxPower(stats, effect)
    const maxPower = stats.attack * effect.power
    return getPower(maxPower)
}

export const getActionSpeed = (maxSpeed: number) => {
    const minSpeed = (maxSpeed * 0.75) | 0
    return randomNumber(minSpeed, maxSpeed)
}
