import { randomNumber } from "./../utils"

export const getPower = (srcMaxPower: number) => {
    const maxPower = Math.abs(srcMaxPower)
    const sign = srcMaxPower > 0 ? 1 : -1
    const minPower = Math.max(1, (maxPower * sign * 0.75) | 0)
    return randomNumber(minPower, maxPower) * sign
}

export const getActionSpeed = (maxSpeed: number) => {
    const minSpeed = (maxSpeed * 0.75) | 0
    return randomNumber(minSpeed, maxSpeed)
}
