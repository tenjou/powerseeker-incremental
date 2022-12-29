import { AbilityId } from "../../config/ability-configs"
import { HTMLComponent } from "../../dom"
import { i18n } from "../../i18n"
import { getState } from "../../state"

const template = document.createElement("template")
template.innerHTML = html`
    <style>
        :host {
            position: relative;
            display: flex;
            flex-direction: row;
            border-radius: 3px;
            flex: 0 0 200px;
            min-height: 40px;
            background: #f5f3f3;
            cursor: pointer;
            border: 1px solid #444;
        }
        :host(:hover) {
            background: #fff;
            outline: 2px solid white;
        }
        :host(.inactive) {
            pointer-events: none;
        }
        :host(:active) {
            transform: translateY(1px);
        }
        :host-context(x-row) {
            margin-right: 6px;
        }

        img {
            display: block;
            padding: 4px;
            width: 32px;
            height: 32px;
            image-rendering: pixelated;
            background: linear-gradient(#bdbdbd, #a0a0a0);
            border-top-left-radius: 2px;
            border-bottom-left-radius: 2px;
            border-right: 1px solid #444;
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
    <x-column class="center-v m-1">
        <x-text id="name" class="bold"></x-text>
        <x-text id="rank" class="tertiary"></x-text>
    </x-column>
`

export class AbilityCard extends HTMLComponent {
    constructor() {
        super(template)
    }

    connectedCallback() {
        this.update()
    }

    update() {
        const { abilities, loadout } = getState()

        const slotId = this.getAttribute("slot-id")

        const slottedAbility = slotId !== null ? loadout.abilities[Number(slotId)] : null
        const abilityId = slottedAbility?.id || (this.getAttribute("ability-id") as AbilityId | null)
        const ability = abilityId ? abilities[abilityId] : null

        const imgElement = this.getElement("img")
        imgElement.setAttribute("src", `/assets/icon/ability/${ability?.id}.png`)

        if (this.getAttribute("inactive") !== null) {
            this.classList.add("inactive")
        }

        this.setText("#name", i18n(abilityId))
        this.setText("#rank", `${i18n("rank")} ${ability?.rank || 0}`)
    }

    static get observedAttributes() {
        return ["ability-id"]
    }
}

customElements.define("ability-card", AbilityCard)
