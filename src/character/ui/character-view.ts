import { AbilitySlotElement } from "../../abilities/ui/ability-slot"
import { StatsTableEntry } from "../../components/stats-table"
import { EquipmentSlot } from "../../config/item-configs"
import { getElementById, toggleClassName } from "../../dom"
import "../../equipment/ui/equipment-slot"
import { subscribe, unsubscribe } from "../../events"
import { ItemSlot } from "../../inventory/ui/item-slot"
import { i18n } from "../../i18n"
import { getState } from "../../state"
import { goTo } from "../../view"
import { EquipmentSlotElement } from "../../equipment/ui/equipment-slot"
import { setText } from "./../../dom"
import { ProgressBar } from "./../../components/progress-bar"
import { LevelConfig } from "../../config/level-config"

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

    updateJobs()

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

    const statsTable = getElementById("stats")
    statsTable.setAttribute("data", JSON.stringify(statsData))

    const equipmentElements = document.querySelectorAll<EquipmentSlotElement>("equipment-slot")
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

function updateJobs() {
    const { player, jobs } = getState()

    getElementById("select-primary-job").onclick = () => {
        goTo("/jobs/primary")
    }
    getElementById("select-secondary-job").onclick = () => {
        goTo("/jobs/secondary")
    }

    const jobPrimary = jobs[player.jobPrimary]
    if (!jobPrimary) {
        console.error(`Could not find job: ${player.jobPrimary}`)
        return
    }

    setText("primary-job-name", i18n(jobPrimary.id))
    setText("primary-job-level", `${i18n("level")} ${jobPrimary.level}`)

    const primaryProgressBar = getElementById("primary-job-exp") as ProgressBar
    primaryProgressBar.setAttrib("value", jobPrimary.exp)
    primaryProgressBar.setAttrib("value-max", LevelConfig[jobPrimary.level])

    if (player.jobSecondary) {
        const jobSecondary = jobs[player.jobSecondary]
        if (!jobSecondary) {
            console.error(`Could not find job: ${player.jobSecondary}`)
            return
        }

        toggleClassName("secondary-job-name", "hidden", false)
        setText("secondary-job-name", i18n(jobSecondary.id))
        setText("secondary-job-level", `${i18n("level")} ${jobPrimary.level}`)
    } else {
        toggleClassName("secondary-job-name", "hidden", true)
        setText("secondary-job-level", i18n("none"))
    }
}

function updateEquipmentSlot(slotType: EquipmentSlot) {
    const equipmentElement = document.querySelector<EquipmentSlotElement>(`[slot-type=${slotType}`)
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
