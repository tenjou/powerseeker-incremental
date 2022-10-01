import { AbilityId } from "../config/ability-configs"
import { EquipmentSlot, ItemConfigs } from "../config/item-configs"
import { getState } from "../state"
import { CharacterStats } from "./character-types"
import { AbilityConfigs } from "./../config/ability-configs"
import { Ability } from "./../abilities/ability-type"

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

export function recalculateStats() {
    const { abilities, battler, equipment, player } = getState()

    battler.stats = createEmptyStats()
    player.power = 0

    for (const slotType in equipment) {
        const item = equipment[slotType as EquipmentSlot]
        if (!item) {
            continue
        }

        const itemConfig = ItemConfigs[item.id]
        if (itemConfig.type !== "equipment") {
            continue
        }

        if (itemConfig.slot === "main_hand") {
            switch (itemConfig.equipmentType) {
                case "axe":
                    addStatsFromPassive(abilities.axe_mastery)
                    break

                case "sword":
                    addStatsFromPassive(abilities.sword_mastery)
                    break
            }
        }

        for (const stat of itemConfig.stats) {
            battler.stats[stat.type] += stat.value
        }

        player.power += item.power
    }
}

function addStatsFromPassive(ability?: Ability) {
    if (!ability || ability.rank === 0) {
        return
    }

    const { battler } = getState()

    const abilityConfig = AbilityConfigs[ability.id]

    for (const effect of abilityConfig.effects) {
        battler.stats[effect.stat] += effect.power * ability.rank
    }
}

export function createEmptyStats(): CharacterStats {
    return {
        health: 10,
        energy: 20,
        accuracy: 1,
        attack: 1,
        critical: 1,
        defense: 1,
        evasion: 1,
        healing: 1,
        speed: 100,
    }
}
