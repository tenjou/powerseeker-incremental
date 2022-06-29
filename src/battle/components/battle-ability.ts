import { Ability, getState } from "../../state"
import { addChild } from "./../../dom"
import { useAbility } from "./../battle"

export function loadAbilities() {
    const { abilities } = getState()

    for (const ability of abilities) {
        loadAbility(ability)
    }
}

function loadAbility(ability: Ability) {
    const element = document.createElement("battle-ability")
    element.onclick = () => useAbility(ability)

    const img = document.createElement("img")
    img.setAttribute("src", `assets/icon/skill/${ability.id}.png`)
    element.appendChild(img)

    addChild("battle-abilities", element)
}
