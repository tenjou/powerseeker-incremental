import { HTMLComponent } from "../../dom"
import { getState } from "../../state"
import { BattlerAbilityEffect } from "./../battle-types"

export class BattlerEffectElement extends HTMLComponent {
    constructor() {
        super(battlerEffectTemplate)
    }

    update(effect: BattlerAbilityEffect) {
        const { battle } = getState()

        const duration = effect.duration - battle.turn

        this.getElement("img").setAttribute("src", `assets/icon/ability/${effect.abilityId}.png`)
        this.setText("#duration", duration)
    }
}

customElements.define("battler-effect", BattlerEffectElement)

const battlerEffectTemplate = document.createElement("template")
battlerEffectTemplate.innerHTML = html`<style>
        :host {
            position: relative;
            margin: 0 1px;
            background: black;
        }
        img {
            display: block;
        }
        div {
            position: absolute;
            right: 0;
            bottom: 0;
            color: #fff;
            background: #00000082;
            font-size: 10px;
        }
    </style>

    <img />
    <div id="duration"></div>`
