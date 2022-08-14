import { AbilityConfig, AbilityConfigs } from "../config/ability-configs"
import { openPopup } from "../popup"
import { getState } from "../state"
import { AbilityId } from "../types"
import { AbilityEffect } from "./../config/ability-configs"
import { getElement, removeAllChildren } from "./../dom"
import { getAbilityEffectPower } from "./abilities-utils"
import "./ability-popup"
import "./ability-slot"

export function loadAbilitiesView() {
    const parent = getElement("abilities-container")

    for (const abilityId in AbilityConfigs) {
        const abilitySlot = document.createElement("ability-slot")
        abilitySlot.setAttribute("ability-id", abilityId)
        abilitySlot.onclick = () => openAbilityPopup(abilityId)
        parent.appendChild(abilitySlot)
    }
}

export function unloadAbilitiesView() {
    removeAllChildren("abilities-container")
}

function openAbilityPopup(abilityId: AbilityId) {
    openPopup("ability-popup", {
        "ability-id": abilityId,
    })
}

export function getAbilityDescription(abilityConfig: AbilityConfig, abilityRank?: number) {
    const { abilities } = getState()

    if (!abilityRank) {
        const ability = abilities.find((entry) => entry.id === abilityConfig.id)
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
        const color = getAbilityEffectColor(effect)
        const power = getAbilityEffectPower(effect, abilityRank)

        description = description.replace(entry, `<x-text class="${color} bold">${power}</x-text>`)
    }

    return description
}

function getAbilityEffectColor(effect: AbilityEffect) {
    switch (effect.type) {
        case "hp-minus":
            return "red"
        case "hp-plus":
            return "green"
    }
}
