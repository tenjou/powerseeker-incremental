import { AbilitySlotElement } from "../../abilities/ability-slot"
import { StatsTableEntry } from "../../components/stats-table"
import { getElement } from "../../dom"
import "../../equipment/equipment-slot"
import { EquipmentSlot } from "../../equipment/equipment-slot"
import { subscribe, unsubscribe } from "../../events"
import { ItemSlot } from "../../inventory/ui/item-slot"
import { i18n } from "../../local"
import { getState } from "../../state"
import { SlotType } from "../../types"
import { goTo } from "../../view"

export function loadCharacterView() {
    updateCharacterView()

    getElement("select-job-primary").onclick = () => goTo("/jobs/primary")
    getElement("select-job-secondary").onclick = () => goTo("/jobs/secondary")

    subscribe("equip", updateEquipmentSlot)
    subscribe("unequip", updateEquipmentSlot)
}

export function unloadCharacterView() {
    unsubscribe("equip", updateEquipmentSlot)
    unsubscribe("unequip", updateEquipmentSlot)
}

export function updateCharacterView() {
    const { player, battler, jobs } = getState()

    const jobPrimary = jobs[player.jobPrimary]
    if (!jobPrimary) {
        console.error(`Could not find job: ${player.jobPrimary}`)
        return
    }

    getElement("job-primary").setAttribute("job-id", player.jobPrimary)
    getElement("job-secondary").setAttribute("job-id", player.jobSecondary || "")

    const statsData: StatsTableEntry[] = [
        {
            key: i18n("health"),
            value: battler.stats.health,
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
    ]

    const statsTable = getElement("stats")
    statsTable.setAttribute("data", JSON.stringify(statsData))

    const equipmentElements = document.querySelectorAll<EquipmentSlot>("equipment-slot")
    equipmentElements.forEach((element) => {
        element.update()
    })

    const abilitiesSlots = document.querySelectorAll<AbilitySlotElement>("ability-slot")
    abilitiesSlots.forEach((element) => {
        element.update()
        element.onclick = () => goTo(`loadout/ability`)
    })

    const itemSlots = document.querySelectorAll<ItemSlot>("item-slot")
    itemSlots.forEach((element) => {
        element.update()
    })

    // upadateLoadoutWidget()
}

function updateEquipmentSlot(slotType: SlotType) {
    const equipmentElement = document.querySelector<EquipmentSlot>(`[slot-type=${slotType}`)
    if (!equipmentElement) {
        console.error(`Could not find EquipmentSlot with slot-type: ${slotType}`)
        return
    }

    equipmentElement.update()
}

function upadateLoadoutWidget() {
    const abilitySlots = document.querySelectorAll<AbilitySlotElement>("ability-slot")
    console.log(abilitySlots)
}
