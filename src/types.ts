import { CardType } from "./config/CardConfigs"
import { ItemId } from "./config/item-configs"

export type SkillId = "woodcutting" | "mining" | "fishing"

export interface Skill {
    id: SkillId
    level: number
    xp: number
    xpMax: number
}

export interface Item {
    uid: number
    id: ItemId
    power: number
    rarity: number
    amount: number
}

export interface Card {
    id: number
    type: CardType
}

export type SlotType = "body" | "main_hand"

export type Brand<T, FlavorT> = T & {
    _type?: FlavorT
}

export type BattleId = Brand<number, "BattleId">
export type BattlerId = Brand<number, "BattlerId">
export type AbilityId = Brand<string, "AbilityId">
