export type SkillId = "woodcutting" | "mining" | "fishing"

export interface Skill {
    id: SkillId
    level: number
    xp: number
    xpMax: number
}

export interface Card {
    id: number
}

export type Brand<T, FlavorT> = T & {
    _type?: FlavorT
}

export type BattlerId = Brand<number, "BattlerId">
