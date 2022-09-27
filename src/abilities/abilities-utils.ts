import { removeCurrency } from "../currencies/currencies"
import { getState } from "./../state"
import { haveCurrency } from "./../currencies/currencies"
import { emit } from "./../events"
import { Ability, AbilityEffect } from "./ability-type"
import { AbilityConfigs, AbilityId } from "../config/ability-configs"
import { Battler } from "../battle/battle-types"

export const getAbilityEffectPower = (effect: AbilityEffect, rank: number) => {
    // return (effect.power * stats[effect.stat]) | 0
    return effect.power * rank
}

export const getRequiredAp = (abilityId: AbilityId) => {
    const { abilities } = getState()

    const ability = abilities[abilityId]
    if (!ability) {
        console.error(`Could not find ability: ${abilityId}`)
        return Number.MAX_SAFE_INTEGER
    }

    return ability.rank
}

export const learnAbility = (abilityId: AbilityId) => {
    const { abilities } = getState()

    const ability = abilities[abilityId]
    if (!ability) {
        console.error(`Could not find ability: ${abilityId}`)
        return
    }

    const needAp = getRequiredAp(abilityId)
    if (!haveCurrency("ap", needAp)) {
        console.error(`Does not have enough AP (${needAp}) to learn the ability (${abilityId})`)
        return
    }

    ability.rank += 1
    removeCurrency("ap", needAp)

    emit("ability-updated", abilityId)
}

export function canUseAbility(battler: Battler, ability: Ability) {
    const energyNeed = getEnergyNeeded(ability)

    return energyNeed <= battler.energy
}

export function getEnergyNeeded(ability: Ability) {
    const abilityConfig = AbilityConfigs[ability.id]
    const energyNeed = abilityConfig.energy + (ability.rank - 1)

    return energyNeed
}
