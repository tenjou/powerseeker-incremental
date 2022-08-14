import "../equipment/equipment-slot"
import { EquipmentSlot } from "../equipment/equipment-slot"
import { getState } from "../state"
import { SlotType } from "../types"
import { StatsTableEntry } from "./../components/stats-table"
import { getElement } from "./../dom"
import { subscribe, unsubscribe } from "./../events"
import { i18n } from "./../local"

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

    const statsData: StatsTableEntry[] = [
        {
            key: i18n("level"),
            value: player.level,
        },
        {
            key: i18n("exp"),
            value: `${player.xp}/${player.xpMax}`,
        },
        {
            key: i18n("health"),
            value: `${battler.hp}/${battler.hpMax}`,
        },
        {
            key: i18n("power"),
            value: player.power,
        },
        {
            key: i18n("attack"),
            value: battler.stats.attack,
        },
        {
            key: i18n("defense"),
            value: battler.stats.defense,
        },
        {
            key: i18n("accuracy"),
            value: battler.stats.accuracy,
        },
        {
            key: i18n("evasion"),
            value: battler.stats.evasion,
        },
        {
            key: i18n("speed"),
            value: battler.stats.speed,
        },
        {
            key: i18n("stamina"),
            value: `${player.stamina}/${player.staminaMax}`,
        },
    ]

    const statsTable = getElement("stats")
    statsTable.setAttribute("data", JSON.stringify(statsData))

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
