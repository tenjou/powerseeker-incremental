import { AbilityConfig, AbilityConfigs, AbilityEffect } from "../config/ability-configs"
import { addChild, setHTML, toggleClassName } from "../dom"
import { Ability, getState } from "../state"
import { toggleTeamInactive } from "./battler-item"
import { getMaxPower } from "./battle-utils"
import { selectAbility } from "./battle"

export function loadAbilities() {
    const { abilities } = getState()

    for (const ability of abilities) {
        loadAbility(ability)
    }
}

function loadAbility(ability: Ability) {
    const element = document.createElement("battle-ability")
    element.id = `ability:${ability.id}`
    element.onclick = () => selectAbility(ability)

    const img = document.createElement("img")
    img.setAttribute("src", `assets/icon/skill/${ability.id}.png`)
    element.appendChild(img)

    addChild("battle-abilities", element)
}

export function renderAbilities() {
    const { battle } = getState()

    const element = document.getElementById("battle-abilities")
    if (!element) {
        return
    }

    for (let n = 0; n < element.children.length; n += 1) {
        const child = element.children[n]
        child.className = ""
    }

    if (battle.selectedAbility) {
        const battler = battle.battlers[battle.playerBattlerId]
        const abilityConfig = AbilityConfigs[battle.selectedAbility.id]
        let abilityTooltip = abilityConfig.tooltip

        const regex = /%[0-9]/gm
        const regexBuff = regex.exec(abilityConfig.tooltip)
        if (regexBuff) {
            const effects = abilityConfig.effects
            for (const entry of regexBuff) {
                const effectId = Number(entry.slice(1))
                const effect = effects[effectId]
                const color = getEffectColor(effect)
                const power = getMaxPower(battler.stats, effect)

                abilityTooltip = abilityTooltip.replace(entry, `<${color}>${power}</${color}>`)
            }
        }

        toggleClassName(`ability:${battle.selectedAbility.id}`, "selected", true)

        toggleClassName("battle-tooltip", "hide", false)
        setHTML("battle-tooltip-title", abilityConfig.name)
        setHTML("battle-tooltip-text", abilityTooltip)

        const abilityUsable = canTargetTeamA(abilityConfig, battle.isTeamA)
        toggleTeamInactive(!battle.isTeamA, abilityUsable)
        toggleTeamInactive(battle.isTeamA, !abilityUsable)
    } else {
        toggleClassName("battle-tooltip", "hide", true)
        toggleTeamInactive(true, false)
        toggleTeamInactive(false, false)
    }
}

function getEffectColor(effect: AbilityEffect) {
    switch (effect.type) {
        case "hp-minus":
            return "red"
        case "hp-plus":
            return "green"
    }
}

function canTargetTeamA(abilityConfig: AbilityConfig, isTeamA: boolean) {
    if (abilityConfig.isOffensive) {
        return !isTeamA
    }

    return isTeamA
}
