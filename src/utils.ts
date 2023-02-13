export const randomNumber = (min: number, max: number) => {
    return (Math.random() * (max - min + 1) + min) << 0
}

export const randomItem = <T>(array: T[]) => {
    return array[randomNumber(0, array.length - 1)]
}

export const shuffle = <T>(array: T[]) => {
    for (let n = array.length - 1; n > 0; n -= 1) {
        let m = Math.floor(Math.random() * (n + 1))
        let temp = array[n]
        array[n] = array[m]
        array[m] = temp
    }
}

export const roll = (chance: number) => {
    return randomNumber(1, 100) <= chance
}

export const clamp = (value: number, min: number, max: number) => {
    if (value > max) {
        return max
    } else if (value < min) {
        return min
    }

    return value
}

export const assert = (expr: boolean, error: string) => {
    if (expr) {
        throw new Error(error)
    }
}
