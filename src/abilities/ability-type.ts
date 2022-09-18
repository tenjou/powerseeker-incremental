import { CharacterStatType } from "../character/character-types"

export type AbilityId = "attack" | "bash" | "heal"

export type AbilityType = "instant" | "passive"

export interface AbilityEffect {
    type: "hp-minus" | "hp-plus"
    power: number
    stat: CharacterStatType
}
