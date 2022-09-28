import { AbilityId } from "../config/ability-configs"

export interface LoadoutAbility {
    id: AbilityId
    rank: number
    cooldown: number
}
