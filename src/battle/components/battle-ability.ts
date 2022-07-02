import { Ability, getState } from "../../state"
import { AbilityId } from "../../types"
import { AbilityConfigs, AbilityEffect } from "./../../config/AbilityConfigs"
import { addChild, setHTML, toggleClassName } from "./../../dom"
import { toggleTeamInactive } from "./battler-item"

export function loadAbilities() {
    const { abilities } = getState()

    for (const ability of abilities) {
        loadAbility(ability)
    }
}

function loadAbility(ability: Ability) {
    const element = document.createElement("battle-ability")
    element.id = `ability:${ability.id}`
    element.onclick = () => selectAbility(ability.id)

    const img = document.createElement("img")
    img.setAttribute("src", `assets/icon/skill/${ability.id}.png`)
    element.appendChild(img)

    addChild("battle-abilities", element)
}

function selectAbility(abilityId: AbilityId) {
    const { battle } = getState()

    battle.selectedAbilityId = abilityId

    updateAbilities()
}

function updateAbilities() {
    const { battle } = getState()

    const element = document.getElementById("battle-abilities")
    if (!element) {
        return
    }

    for (let n = 0; n < element.children.length; n += 1) {
        const child = element.children[n]
        child.className = ""
    }

    let inactiveTeamA = true

    if (battle.selectedAbilityId) {
        const abilityConfig = AbilityConfigs[battle.selectedAbilityId]
        let abilityTooltip = abilityConfig.tooltip

        const regex = /%[0-9]/gm
        const regexBuff = regex.exec(abilityConfig.tooltip)
        if (regexBuff) {
            const effects = abilityConfig.effects
            for (const entry of regexBuff) {
                const effectId = Number(entry.slice(1))
                const effect = effects[effectId]
                const color = getEffectColor(effect)

                abilityTooltip = abilityTooltip.replace(entry, `<${color}>${effect.power}</${color}>`)
            }
        }

        toggleClassName(`ability:${battle.selectedAbilityId}`, "selected", true)

        toggleClassName("battle-tooltip", "hide", false)
        setHTML("battle-tooltip-title", abilityConfig.name)
        setHTML("battle-tooltip-text", abilityTooltip)

        inactiveTeamA = abilityConfig.isOffensive
    } else {
        toggleClassName("battle-tooltip", "hide", true)
    }

    toggleTeamInactive(inactiveTeamA, true)
    toggleTeamInactive(!inactiveTeamA, false)
}

function getEffectColor(effect: AbilityEffect) {
    switch (effect.type) {
        case "hp-minus":
            return "red"
        case "hp-plus":
            return "green"
    }
}
