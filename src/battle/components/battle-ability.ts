import { Ability, getState } from "../../state"
import { AbilityId } from "../../types"
import { addChild, toggleClassName } from "./../../dom"
import { useAbility } from "./../battle"

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

    if (battle.selectedAbilityId) {
        toggleClassName(`ability:${battle.selectedAbilityId}`, "selected", true)
    }
}
