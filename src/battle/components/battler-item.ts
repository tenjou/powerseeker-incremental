import { HTMLComponent } from "../../dom"
import { Battler } from "../../types"
import { addChild } from "./../../dom"

export function updateBattler(battler: Battler) {
    const element = document.getElementById(`battler:${battler.id}`) as BattlerItem
    element.update(battler)
}

export function loadBattler(battler: Battler) {
    const element = document.createElement("battler-item") as BattlerItem
    element.id = `battler:${battler.id}`
    element.update(battler)

    if (battler.isTeamA) {
        addChild("battle-column-a", element)
    } else {
        addChild("battle-column-b", element)
    }
}

class BattlerItem extends HTMLComponent {
    constructor() {
        super(template)
    }

    update(battler: Battler) {
        this.getElement("#name").innerText = battler.name
        this.getElement("#level").innerText = String(battler.level)
        this.getElement("progress-bar").setAttribute("value", `${battler.hp}`)
        this.getElement("progress-bar").setAttribute("value-max", `${battler.hpMax}`)
    }
}

customElements.define("battler-item", BattlerItem)

const template = document.createElement("template")
template.innerHTML = html`<style>
        :host {
            display: flex;
            flex-direction: row;
            width: 100px;
            border-radius: 3px;
        }

        :host.shake {
            animation-name: battler-shake;
            animation-duration: 0.2s;
            animation-iteration-count: 1;
        }

        .column {
            display: flex;
            flex-direction: column;
            flex: 1;
        }
    </style>

    <div id="level"></div>
    <div class="column">
        <div id="name"></div>
        <progress-bar value="10" value-max="30"></progress-bar>
    </div> `
