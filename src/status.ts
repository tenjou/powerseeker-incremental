import { setText } from "./dom"
import { getState } from "./state"

export function updateStatus() {
    const { status, stats } = getState()

    setText(`stats-level`, `Level: ${stats.level}`)
    setText(`stats-hp`, `HP: ${stats.hp}/${stats.hpMax}`)
    setText(`stats-power`, `Power: ${stats.power}`)
    setText(`stats-defense`, `Defense: ${stats.defense}`)

    setText(`value-stamina`, `${status.stamina}/${status.staminaMax}`)
    setText(`value-gold`, `${status.gold}`)
}

export function addHp(value: number) {
    const { stats } = getState()

    stats.hp += value
    if (stats.hp > stats.hpMax) {
        stats.hp = stats.hpMax
    } else if (stats.hp < 0) {
        stats.hp = 0
    }

    updateStatus()
}

export function addStamina(value: number) {
    const { status } = getState()

    status.stamina += value
    if (status.stamina > status.staminaMax) {
        status.stamina = status.staminaMax
    } else if (status.stamina < 0) {
        status.stamina = 0
    }

    updateStatus()
}

export function addGold(value: number) {
    const { status } = getState()

    status.gold += value

    updateStatus()
}

export function restoreStatus() {
    const { status, stats } = getState()

    stats.hp = stats.hpMax

    status.stamina = status.staminaMax

    updateStatus()
}
