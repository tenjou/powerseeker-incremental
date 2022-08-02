import { setText } from "../dom"
import { getState } from "../state"

export function loadCharacterView() {
    updateCharacterView()
}

export function unloadCharacterView() {}

export function updateCharacterView() {
    const { player, battler } = getState()

    setText("character-level", `Level: ${player.level}`)
    setText("character-exp", `Experience: ${player.xp}/${player.xpMax}`)
    setText("character-hp", `HP: ${battler.hp}/${battler.hpMax}`)
    setText("character-attack", `Attack: ${battler.stats.attack}`)
    setText("character-defense", `Defense: ${battler.stats.defense}`)
    setText("character-speed", `Speed: ${battler.stats.speed}`)
    setText("character-stamina", `Stamina: ${player.stamina}/${player.staminaMax}`)
    setText("character-gold", `Gold: ${player.gold}`)
}
