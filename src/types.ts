import { CardType } from "./config/CardConfigs"

export type SkillId = "woodcutting" | "mining" | "fishing"

export interface Skill {
    level: number
    xp: number
    xpMax: number
}

export interface Item {
    id: string
    amount: number
}

export interface Card {
    id: number
    type: CardType
}

export interface Status {
    xp: number
    xpMax: number
    stamina: number
    staminaMax: number
    gold: number
}
