import { CharacterStatType } from "../character/character-types"
import { AbilityId } from "../config/ability-configs"

export type AbilityType = "instant" | "passive"

export interface AbilityEffect {
    type: "hp-minus" | "hp-plus"
    power: number
    stat: CharacterStatType
}

export interface Ability {
    id: AbilityId
    rank: number
}
