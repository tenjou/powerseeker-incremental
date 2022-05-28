import { CardType } from "./config/CardConfigs"
import { ItemId } from "./config/ItemConfigs"

export type SkillId = "woodcutting" | "mining" | "fishing"

export interface Skill {
    level: number
    xp: number
    xpMax: number
}

export interface Item {
    uid: number
    id: ItemId
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

export type SlotType = "body" | "hand_1"
