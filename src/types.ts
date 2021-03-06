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

export type SlotType = "body" | "hand_1"

export type Brand<T, FlavorT> = T & {
    _type?: FlavorT
}

export type BattleId = Brand<number, "BattleId">
export type BattlerId = Brand<number, "BattlerId">
export type AbilityId = Brand<string, "AbilityId">
