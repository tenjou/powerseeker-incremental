import { Battler } from "../battle/battle-types"
import { recalculateStats } from "../character/status"
import { AbilityConfigs, AbilityId } from "../config/ability-configs"
import { removeCurrency } from "../currencies/currencies"
import { haveCurrency } from "./../currencies/currencies"
import { emit } from "./../events"
import { LoadoutAbility } from "./../loadout/loadout-types"
import { getState } from "./../state"
import { Ability, AbilityEffect, AbilityEffectType } from "./ability-type"

export const getAbilityEffectPower = (effect: AbilityEffect, rank: number) => {
    const { battle } = getState()

    const battler = battle.battlers[battle.playerBattlerId]

    return battler.stats[effect.stat] * effect.power * rank
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
    recalculateStats()

    emit("ability-updated", abilityId)
}

export function canUseAbility(battler: Battler, ability: LoadoutAbility) {
    const { battle } = getState()

    const cooldown = ability.cooldown - (battle.turn - 1)
    if (cooldown > 0) {
        return
    }

    const energyNeed = getEnergyNeeded(ability)
    return energyNeed <= battler.mana
}

export function getEnergyNeeded(ability: Ability) {
    const abilityConfig = AbilityConfigs[ability.id]
    if (abilityConfig.type !== "instant") {
        return 0
    }

    const energyNeed = abilityConfig.energy + (ability.rank - 1)
    return energyNeed
}

export const getAbilityEffectColor = (effectType: AbilityEffectType, power: number) => {
    switch (effectType) {
        case "health":
            return power > 0 ? "green" : "red"

        case "energy":
            return power > 0 ? "energy-up" : "energy-down"
    }
}

const iconMapping: Record<string, string> = {
    fire_attack: "attack",
    water_attack: "attack",
    earth_attack: "attack",
    air_attack: "attack",
}

export const getAbilityIconPath = (abilityId: AbilityId) => {
    const mappedId = iconMapping[abilityId] || abilityId

    return `/assets/icon/ability/${mappedId}.png`
}
