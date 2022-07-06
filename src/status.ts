import { ItemConfigs } from "./config/ItemConfigs"
import { render, renderParentId } from "./dom"
import { getState } from "./state"
import { SlotType } from "./types"

export function updatePlayerStatus() {
    const { player, battler } = getState()

    renderParentId("stats", [
        render("div", `Level: ${player.level}`),
        render("div", `Experience: ${player.xp}/${player.xpMax}`),
        render("div", `HP: ${battler.hp}/${battler.hpMax}`),
        render("div", `Attack: ${battler.stats.attack}`),
        render("div", `Defense: ${battler.stats.defense}`),
        render("div", `Speed: ${battler.stats.speed}`),
    ])

    renderParentId("status", [render("div", `Stamina: ${player.stamina}/${player.staminaMax}`), render("div", `Gold: ${player.gold}`)])
}

export function addHp(value: number) {
    const { battler } = getState()

    battler.hp += value
    if (battler.hp > battler.hpMax) {
        battler.hp = battler.hpMax
    } else if (battler.hp < 0) {
        battler.hp = 0
    }

    updatePlayerStatus()
}

export function addStamina(value: number) {
    const { player: status } = getState()

    status.stamina += value
    if (status.stamina > status.staminaMax) {
        status.stamina = status.staminaMax
    } else if (status.stamina < 0) {
        status.stamina = 0
    }

    updatePlayerStatus()
}

export function addGold(value: number) {
    const { player: status } = getState()

    status.gold += value

    updatePlayerStatus()
}

export function restoreStatus() {
    const { player, battler } = getState()

    battler.hp = battler.hpMax
    player.stamina = player.staminaMax

    updatePlayerStatus()
}

export function recalculateStats() {
    const { battler, equipment } = getState()

    battler.stats.defense = 0

    for (const slotType in equipment) {
        const item = equipment[slotType as SlotType]
        if (!item) {
            continue
        }

        const itemConfig = ItemConfigs[item.id]
        switch (itemConfig.type) {
            case "armor":
                battler.stats.defense += itemConfig.defense
                break
        }
    }

    updatePlayerStatus()
}
