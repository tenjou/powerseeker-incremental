import { getAbilityDescription } from "../../abilities/abilities-view"
import { AbilityConfig, AbilityConfigs } from "../../config/ability-configs"
import { addChild, setHTML, toggleClassName } from "../../dom"
import { Ability, getState } from "../../state"
import { selectAbility } from "../battle"
import { toggleTeamInactive } from "./battler-item"
import { i18n } from "../../local"

export function loadAbilities() {
    const { abilities, loadout } = getState()

    for (const abilityId of loadout.abilities) {
        if (!abilityId) {
            continue
        }

        const ability = abilities[abilityId]
        if (!ability) {
            continue
        }

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
        const abilityConfig = AbilityConfigs[battle.selectedAbility.id]
        const abilityTooltip = getAbilityDescription(abilityConfig)

        toggleClassName(`ability:${battle.selectedAbility.id}`, "selected", true)
        toggleClassName("battle-tooltip", "hide", false)
        setHTML("battle-tooltip-title", i18n(abilityConfig.id))
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

function canTargetTeamA(abilityConfig: AbilityConfig, isTeamA: boolean) {
    if (abilityConfig.isOffensive) {
        return !isTeamA
    }

    return isTeamA
}
