import { randomNumber } from "./../utils"

export const getActionSpeed = (speedMax: number) => {
    const speedMin = (speedMax * 0.75) | 0
    return randomNumber(speedMin, speedMax)
}
