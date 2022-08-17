import { AbilityConfigs, AbilityId } from "../config/ability-configs"
import { HTMLComponent } from "../dom"
import { getState } from "./../state"

const template = document.createElement("template")
template.innerHTML = html`<style>
        :host {
            position: relative;
            display: flex;
            flex-direction: column;
            border-radius: 3px;
            width: 40px;
            min-height: 40px;
            background: #b5b5b5;
            cursor: pointer;
        }
        :host(:hover) {
            outline: 2px solid white;
        }
        :host(.inactive) {
            pointer-events: none;
        }
        :host-context(x-row) {
            margin-right: 6px;
        }

        img {
            padding: 4px;
            width: 32px;
            height: 32px;
            image-rendering: pixelated;
        }

        rank {
            width: 100%;
            flex: 1;
            padding: 0 4px;
            box-sizing: border-box;
            font-size: 9px;
            text-align: center;
            text-shadow: 0 0 2px black;
            color: #fff;
            border-bottom-left-radius: 3px;
            border-bottom-right-radius: 3px;
            background: #000;
        }

        amount {
            position: absolute;
            right: 0;
            top: 29px;
            color: #fff;
            background: #000000ad;
            padding: 0 3px;
            font-size: 10px;
            border-radius: 2px;
            text-shadow: 0 0 2px black;
        }

        .hide {
            display: none;
        }
    </style>

    <img />
    <rank></rank>
    <amount></amount>`

export class AbilitySlotElement extends HTMLComponent {
    constructor() {
        super(template)
    }

    connectedCallback() {
        this.update()
    }

    attributeChangedCallback() {
        this.update()
    }

    update() {
        const { abilities, loadout } = getState()

        const slotId = this.getAttribute("slot-id")
        const hideRank = this.haveAttribute("hide-rank")

        const slottedAbilityId = slotId !== null ? loadout.abilities[Number(slotId)] : null
        const abilityId = slottedAbilityId || (this.getAttribute("ability-id") as AbilityId | null)
        const ability = abilityId ? abilities[abilityId] : null

        const imgElement = this.getElement("img")

        if (ability) {
            imgElement.setAttribute("src", `/assets/icon/skill/${ability.id}.png`)
            imgElement.classList.remove("hide")

            this.setText("rank", `${ability.rank} / 10`)
        } else {
            imgElement.classList.add("hide")
        }

        this.toggleClassName("hide", hideRank, "rank")

        if (this.getAttribute("inactive") !== null) {
            this.classList.add("inactive")
        }
    }

    static get observedAttributes() {
        return ["ability-id"]
    }
}

customElements.define("ability-slot", AbilitySlotElement)
