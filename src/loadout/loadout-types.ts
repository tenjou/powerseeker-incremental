import { SkillId } from "../config/skill-configs"

export interface LoadoutSkill {
    id: SkillId
    rank: number
    cooldown: number
}
