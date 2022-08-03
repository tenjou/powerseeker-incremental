import { setText } from "../dom"
import { getState } from "../state"
import { SlotType } from "../types"
import { subscribe, unsubscribe } from "./../events"
import "../equipment/equipment-slot"
import { EquipmentSlot } from "../equipment/equipment-slot"

export function loadCharacterView() {
    updateCharacterView()

    subscribe("equip", updateEquipmentSlot)
    subscribe("unequip", updateEquipmentSlot)
}

export function unloadCharacterView() {
    unsubscribe("equip", updateEquipmentSlot)
    unsubscribe("unequip", updateEquipmentSlot)
}

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

    const equipmentElements = document.querySelectorAll<EquipmentSlot>("equipment-slot")
    equipmentElements.forEach((element) => {
        element.update()
    })
}

function updateEquipmentSlot(slotType: SlotType) {
    const equipmentElement = document.querySelector<EquipmentSlot>(`[slot-type=${slotType}`)
    if (!equipmentElement) {
        console.error(`Could not find EquipmentSlot with slot-type: ${slotType}`)
        return
    }

    equipmentElement.update()
}
