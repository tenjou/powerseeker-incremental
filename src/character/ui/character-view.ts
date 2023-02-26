import { EquipmentSlot } from "../../config/item-configs"
import { getElement } from "../../dom"
import "../../equipment/ui/equipment-slot"
import { EquipmentSlotElement } from "../../equipment/ui/equipment-slot"
import { subscribe } from "../../events"
import { AbilitySlotElement } from "../../skills/ui/ability-slot"
import { PlayerService } from "./../../player/player-service"
import "./character-attributes"
import { CharacterAttributes } from "./character-attributes"
import "./character-info"
import { CharacterInfo } from "./character-info"
import "./character-powers"
import { CharacterPowers } from "./character-powers"
import "./character-resistances"
import { CharacterResistances } from "./character-resistances"
import "./stats-row"

export function loadCharacterView() {
    updateCharacterInfo()
    updateCharacterAttributes()

    getElement("#add-exp").onclick = () => {
        PlayerService.addExp(60)
    }

    subscribe("exp-updated", updateCharacterInfo)
    subscribe("attributes-updated", updateCharacterAttributes)

    // subscribe("equip", updateEquipmentSlot)
    // subscribe("unequip", updateEquipmentSlot)
    // updateCharacterView()
}

const updateCharacterInfo = () => {
    getElement<CharacterInfo>("character-info").update()
}

const updateCharacterAttributes = () => {
    getElement<CharacterAttributes>("character-attributes").update()
    getElement<CharacterPowers>("character-powers").update()
    getElement<CharacterResistances>("character-resistances").update()
}

export function unloadCharacterView() {}

export function updateCharacterView() {
    // const { player, battler } = getState()
    // updateJobs()
    // const statsData: StatsTableEntry[] = [
    //     {
    //         key: i18n("health"),
    //         value: battler.stats.health,
    //     },
    //     {
    //         key: i18n("power"),
    //         value: player.power,
    //     },
    //     {
    //         key: i18n("attack"),
    //         value: battler.stats.attack,
    //     },
    //     {
    //         key: i18n("defense"),
    //         value: battler.stats.defense,
    //     },
    //     {
    //         key: i18n("accuracy"),
    //         value: battler.stats.accuracy,
    //     },
    //     {
    //         key: i18n("evasion"),
    //         value: battler.stats.evasion,
    //     },
    //     {
    //         key: i18n("speed"),
    //         value: battler.stats.speed,
    //     },
    // ]
    // const statsTable = getElementById("stats")
    // statsTable.setAttribute("data", JSON.stringify(statsData))
    // const equipmentElements = document.querySelectorAll<EquipmentSlotElement>("equipment-slot")
    // equipmentElements.forEach((element) => {
    //     element.update()
    // })
    // const abilitiesSlots = document.querySelectorAll<AbilitySlotElement>("ability-slot")
    // abilitiesSlots.forEach((element) => {
    //     element.update()
    //     element.onclick = () => goTo(`loadout/ability`)
    // })
    // const itemSlots = document.querySelectorAll<ItemIconSlot>("item-slot")
    // itemSlots.forEach((element) => {
    //     // element.update()
    // })
    // upadateLoadoutWidget()
}

// function updateJobs() {
//     const { player, jobs } = getState()

//     getElementById("select-primary-job").onclick = () => {
//         goTo("/jobs/primary")
//     }
//     getElementById("select-secondary-job").onclick = () => {
//         goTo("/jobs/secondary")
//     }

//     const jobPrimary = jobs[player.jobPrimary]
//     if (!jobPrimary) {
//         console.error(`Could not find job: ${player.jobPrimary}`)
//         return
//     }

//     setText("primary-job-name", i18n(jobPrimary.id))
//     setText("primary-job-level", `${i18n("level")} ${jobPrimary.level}`)

//     const primaryProgressBar = getElementById("primary-job-exp") as ProgressBar
//     primaryProgressBar.setAttrib("value", jobPrimary.exp)
//     primaryProgressBar.setAttrib("value-max", LevelConfig[jobPrimary.level])

//     if (player.jobSecondary) {
//         const jobSecondary = jobs[player.jobSecondary]
//         if (!jobSecondary) {
//             console.error(`Could not find job: ${player.jobSecondary}`)
//             return
//         }

//         toggleClassName("secondary-job-name", "hidden", false)
//         setText("secondary-job-name", i18n(jobSecondary.id))
//         setText("secondary-job-level", `${i18n("level")} ${jobPrimary.level}`)
//     } else {
//         toggleClassName("secondary-job-name", "hidden", true)
//         setText("secondary-job-level", i18n("none"))
//     }
// }

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
