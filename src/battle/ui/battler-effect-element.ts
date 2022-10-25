import { HTMLComponent } from "../../dom"
import { BattlerAbilityEffect } from "./../battle-types"

export class BattlerEffectElement extends HTMLComponent {
    constructor() {
        super(battlerEffectTemplate)
    }

    update(effect: BattlerAbilityEffect) {
        this.getElement("img").setAttribute("src", `assets/icon/ability/${effect.abilityId}.png`)
        this.setText("#duration", (effect.duration + 0.5) | 0)
    }
}

customElements.define("battler-effect", BattlerEffectElement)

const battlerEffectTemplate = document.createElement("template")
battlerEffectTemplate.innerHTML = html`<style>
        :host {
            position: relative;
            margin: 0 1px;
            background: #bdbdbd;
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
