import { EquipmentSlotType, ItemConfigs } from "../config/item-configs"
import { getState } from "../state"
import { SkillConfigs } from "../config/skill-configs"
import { CharacterStats } from "./character-types"
import { Skill } from "../skills/skills-types"

export function addHp(value: number) {
    const { battler } = getState()

    battler.health += value
    if (battler.health > battler.stats.health) {
        battler.health = battler.stats.health
    } else if (battler.health < 0) {
        battler.health = 0
    }
}

export function addStamina(value: number) {
    const { player } = getState()

    player.stamina += value
    if (player.stamina > player.staminaMax) {
        player.stamina = player.staminaMax
    } else if (player.stamina < 0) {
        player.stamina = 0
    }
}

export function restoreStatus() {
    const { player, battler } = getState()

    battler.health = battler.stats.health
    player.stamina = player.staminaMax
}

function addStatsFromPassive(skill?: Skill) {
    if (!skill || skill.rank === 0) {
        return
    }

    const { battler } = getState()

    const abilityConfig = SkillConfigs[skill.id]

    for (const effect of abilityConfig.effects) {
        // battler.stats[effect.stat] += effect.power * ability.rank
    }
}

export function createEmptyStats(): CharacterStats {
    return {
        health: 10,
        mana: 20,
        accuracy: 1,
        critical: 1,
        evasion: 1,
        speed: 100,
        regenMana: 0,
        regenHealth: 0,
        firePower: 1,
        waterPower: 1,
        airPower: 1,
        earthPower: 1,
        fireResistance: 0,
        waterResistance: 0,
        airResistance: 0,
        earthResistance: 0,
    }
}
