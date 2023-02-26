import { Battler } from "../battle/battle-types"
import { SkillConfigs, SkillId } from "../config/skill-configs"
import { removeCurrency } from "../currencies/currencies"
import { haveCurrency } from "../currencies/currencies"
import { emit } from "../events"
import { LoadoutSkill as LoadoutSkill } from "../loadout/loadout-types"
import { getState } from "../state"
import { Skill as Skill, SkillEffect, SkillEffectType as SkillEffectType } from "./skills-types"
import { PlayerService } from "./../player/player-service"

export const getSkillEffectPower = (effect: SkillEffect, rank: number) => {
    const { battle } = getState()

    const battler = battle.battlers[battle.playerBattlerId]

    return battler.stats[effect.stat] * effect.power * rank
}

export const getRequiredAp = (abilityId: SkillId) => {
    const { skills: abilities } = getState()

    const ability = abilities[abilityId]
    if (!ability) {
        console.error(`Could not find ability: ${abilityId}`)
        return Number.MAX_SAFE_INTEGER
    }

    return ability.rank
}

export const learnSkill = (skillId: SkillId) => {
    const { skills: abilities } = getState()

    const ability = abilities[skillId]
    if (!ability) {
        console.error(`Could not find skill: ${skillId}`)
        return
    }

    const needAp = getRequiredAp(skillId)
    // if (!haveCurrency("ap", needAp)) {
    //     console.error(`Does not have enough AP (${needAp}) to learn the skill (${skillId})`)
    //     return
    // }

    ability.rank += 1
    // removeCurrency("ap", needAp)
    PlayerService.calculateStats()

    emit("ability-updated", skillId)
}

export function canUseSkill(battler: Battler, skill: LoadoutSkill) {
    const { battle } = getState()

    const cooldown = skill.cooldown - (battle.turn - 1)
    if (cooldown > 0) {
        return
    }

    const energyNeed = getEnergyNeeded(skill)
    return energyNeed <= battler.mana
}

export function getEnergyNeeded(skill: Skill) {
    const abilityConfig = SkillConfigs[skill.id]
    if (abilityConfig.type !== "instant") {
        return 0
    }

    const energyNeed = abilityConfig.energy + (skill.rank - 1)
    return energyNeed
}

export const getSkillEffectColor = (effectType: SkillEffectType, power: number) => {
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

export const getSkillIconPath = (abilityId: SkillId) => {
    const mappedId = iconMapping[abilityId] || abilityId

    return `/assets/icon/skills/${mappedId}.png`
}
