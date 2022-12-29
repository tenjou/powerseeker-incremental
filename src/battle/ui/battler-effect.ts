import { HTMLComponent } from "../../dom"
import { BattlerAbilityEffect } from "../battle-types"

export class BattlerEffect extends HTMLComponent {
    constructor() {
        super(template)
    }

    update(effect: BattlerAbilityEffect) {
        this.getElement("img").setAttribute("src", `/assets/icon/ability/${effect.abilityId}.png`)
        this.setText("#duration", (effect.duration + 0.5) | 0)
    }
}

customElements.define("battler-effect", BattlerEffect)

const template = document.createElement("template")
template.innerHTML = html`
    <img class="block" />
    <div id="duration"></div>
`
