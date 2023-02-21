import { HTMLComponent } from "../../dom"
import { i18n } from "../../i18n"
import { getState } from "../../state"
import { StatsRow } from "./stats-row"

export interface StatsRowEntry {
    key: string
    value: number | string
}

const template = document.createElement("template")
template.className = "mb-3 width-180px"
template.innerHTML = html`
    <div class="mb-1 px-2 bold font-2">${i18n("resistances")}</div>
    <div class="highlight-row"></div>
`

export class CharacterResistances extends HTMLComponent {
    constructor() {
        super(template)
    }

    update() {
        const { battler } = getState()
    }
}

customElements.define("character-resistances", CharacterResistances)
