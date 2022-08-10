import { ItemConfigs } from "../config/ItemConfigs"
import { getState } from "../state"
import { SlotType } from "../types"
import { CharacterStats, CharacterStatType } from "./character-types"

export function addHp(value: number) {
    const { battler } = getState()

    battler.hp += value
    if (battler.hp > battler.hpMax) {
        battler.hp = battler.hpMax
    } else if (battler.hp < 0) {
        battler.hp = 0
    }
}

export function addStamina(value: number) {
    const { player: status } = getState()

    status.stamina += value
    if (status.stamina > status.staminaMax) {
        status.stamina = status.staminaMax
    } else if (status.stamina < 0) {
        status.stamina = 0
    }
}

export function addGold(value: number) {
    const { player: status } = getState()

    status.gold += value
}

export function restoreStatus() {
    const { player, battler } = getState()

    battler.hp = battler.hpMax
    player.stamina = player.staminaMax
}

export function recalculateStats() {
    const { battler, equipment } = getState()

    battler.stats = createEmptyStats()

    for (const slotType in equipment) {
        const item = equipment[slotType as SlotType]
        if (!item) {
            continue
        }

        const itemConfig = ItemConfigs[item.id]
        if (itemConfig.type !== "armor") {
            continue
        }

        for (const stat of itemConfig.stats) {
            battler.stats[stat.type] += stat.value
        }
    }
}

export function createEmptyStats(): CharacterStats {
    return {
        accuracy: 1,
        attack: 1,
        critical: 1,
        defense: 1,
        evasion: 1,
        healing: 1,
        speed: 1,
    }
}
