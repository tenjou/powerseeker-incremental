import { AbilityId } from "../types"
import { AbilityEffect } from "./../config/ability-configs"
import { getState } from "./../state"

export const getAbilityEffectPower = (effect: AbilityEffect, rank: number) => {
    // return (effect.power * stats[effect.stat]) | 0
    return effect.power * rank
}

export const getRequiredAp = (abilityId: AbilityId) => {
    const { abilities } = getState()

    const ability = abilities.find((entry) => entry.id === abilityId)
    if (!ability) {
        console.error(`Could not find ability: ${abilityId}`)
        return
    }

    return ability.rank
}
