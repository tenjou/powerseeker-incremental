import { AbilityConfig, AbilityConfigs, AbilityId } from "../../config/ability-configs"
import { getState } from "../../state"
import { getElementById, removeAllChildren } from "../../dom"
import { getAbilityEffectColor, getAbilityEffectPower } from "../abilities-utils"
import "./ability-popup"
import "./ability-slot"
import "./ability-card"
import { AbilitySlotElement } from "./ability-slot"
import { subscribe, unsubscribe } from "../../events"
import { AbilityEffect } from "../ability-type"
import { PopupService } from "./../../popup"

export function loadAbilitiesView() {
    const parent = getElementById("abilities-container")

    for (const abilityId in AbilityConfigs) {
        const abilitySlot = document.createElement("ability-card")
        abilitySlot.setAttribute("ability-id", abilityId)
        abilitySlot.onclick = () => openAbilityPopup(abilityId as AbilityId)
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

function openAbilityPopup(abilityId: AbilityId) {
    PopupService.open("ability-popup", {
        "ability-id": abilityId,
    })
}

export function getAbilityDescription(abilityConfig: AbilityConfig, abilityRank?: number) {
    const { abilities } = getState()

    if (!abilityRank) {
        const ability = abilities[abilityConfig.id]
        abilityRank = ability ? ability.rank : 1
    }

    const regex = /%[0-9]/gm
    const regexDescription = regex.exec(abilityConfig.description)
    if (!regexDescription) {
        return abilityConfig.description
    }

    let description = abilityConfig.description

    const effects = abilityConfig.effects
    for (const entry of regexDescription) {
        const effectId = Number(entry.slice(1))
        const effect = effects[effectId]
        const power = getAbilityEffectPower(effect, abilityRank)
        const color = getAbilityEffectColor(effect.type, power)

        description = description.replace(entry, `<x-text class="${color} bold">${Math.abs(power)}</x-text>`)
    }

    return description
}
