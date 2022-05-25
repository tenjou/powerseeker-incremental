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

export interface Battler {
    id: number
    name: string
    isTeamA: boolean
    level: number
    hp: number
    hpMax: number
    power: number
    defense: number
    speed: number
    tNextAttack: number
}
