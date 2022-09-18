import { randomNumber } from "./../utils"
import { CharacterStats } from "./../character/character-types"
import { AbilityEffect } from "../abilities/ability-type"
// import { getMaxPower } from "./../abilities/abilities-utils"

export const getPower = (maxPower: number) => {
    const minPower = Math.max(1, (maxPower * 0.75) | 0)
    return randomNumber(minPower, maxPower)
}

export const calculatePower = (stats: CharacterStats, effect: AbilityEffect) => {
    // const maxPower = getMaxPower(stats, effect)
    // return getPower(maxPower)
    return 1
}

export const getActionSpeed = (maxSpeed: number) => {
    const minSpeed = (maxSpeed * 0.75) | 0
    return randomNumber(minSpeed, maxSpeed)
}
