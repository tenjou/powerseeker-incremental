export const randomNumber = (min: number, max: number) => {
    return (Math.random() * (max - min + 1) + min) << 0
}

export const randomItem = <T>(array: T[]) => {
    return array[randomNumber(0, array.length - 1)]
}
