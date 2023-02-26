import { CharacterStatType } from "../character/character-types"
import { SkillId } from "../config/skill-configs"

export type SkillEffectType = "health" | "energy" | "stat"

export type ElementType = "fire" | "water" | "earth" | "air"

export interface SkillEffect {
    type: SkillEffectType
    power: number
    stat: CharacterStatType
}

export interface Skill {
    id: SkillId
    rank: number
}
