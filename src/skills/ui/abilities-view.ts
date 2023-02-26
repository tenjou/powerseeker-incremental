import { SkillConfig, SkillConfigs, SkillId } from "../../config/skill-configs"
import { getState } from "../../state"
import { getElementById, removeAllChildren } from "../../dom"
import { getSkillEffectColor, getSkillEffectPower } from "../skills-utils"
import "./ability-popup"
import "./ability-slot"
import "./ability-card"
import { AbilitySlotElement } from "./ability-slot"
import { subscribe, unsubscribe } from "../../events"
import { SkillEffect } from "../skills-types"
import { PopupService } from "./../../popup"
import { i18n } from "../../i18n"

export function loadAbilitiesView() {
    const parent = getElementById("abilities-container")

    for (const abilityId in SkillConfigs) {
        const abilitySlot = document.createElement("ability-card")
        abilitySlot.setAttribute("ability-id", abilityId)
        abilitySlot.onclick = () => openAbilityPopup(abilityId as SkillId)
        parent.appendChild(abilitySlot)
    }

    subscribe("ability-updated", updateView)
}

export function unloadAbilitiesView() {
    removeAllChildren("abilities-container")

    unsubscribe("ability-updated", updateView)
}

function updateView() {
    const parent = getElementById("abilities-container")
    parent.childNodes.forEach((element) => {
        ;(element as AbilitySlotElement).update()
    })
}

function openAbilityPopup(abilityId: SkillId) {
    PopupService.open("ability-popup", {
        "ability-id": abilityId,
    })
}

export const getAbilityDescription = (abilityConfig: SkillConfig, abilityRank?: number) => {
    const { skills: abilities } = getState()

    if (!abilityRank) {
        const ability = abilities[abilityConfig.id]
        abilityRank = ability ? ability.rank : 1
    }

    let abilityDescription = i18n(`${abilityConfig.id}_description`)

    const regex = /%[0-9]/gm
    const regexDescription = regex.exec(abilityDescription)
    if (!regexDescription) {
        return abilityDescription
    }

    const effects = abilityConfig.effects
    for (const entry of regexDescription) {
        const effectId = Number(entry.slice(1))
        const effect = effects[effectId]
        const power = getSkillEffectPower(effect, abilityRank)
        const color = getSkillEffectColor(effect.type, power)

        abilityDescription = abilityDescription.replace(entry, `<x-text class="${color} bold">${Math.abs(power)}</x-text>`)
    }

    return abilityDescription
}
