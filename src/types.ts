export interface Card {
    id: number
}

export type Brand<T, FlavorT> = T & {
    _type?: FlavorT
}

export type BattlerId = Brand<number, "BattlerId">
