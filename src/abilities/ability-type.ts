import { CharacterStatType } from "../character/character-types"
import { AbilityId } from "../config/ability-configs"

export type AbilityEffectType = "health" | "energy" | "stat"

export interface AbilityEffect {
    type: AbilityEffectType
    power: number
    stat: CharacterStatType
}

export interface Ability {
    id: AbilityId
    rank: number
}
