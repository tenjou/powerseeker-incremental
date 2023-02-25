import { HTMLComponent } from "../../dom"
import { i18n } from "../../i18n"
import { getState } from "../../state"
import { StatsRow } from "./stats-row"

const template = document.createElement("template")
template.className = "mb-3 width-180px"
template.innerHTML = html`
    <div class="mb-2 px-2 bold font-2">${i18n("powers")}</div>
    <div class="highlight-row">
        <stats-row id="power-fire"><div class="element-icon fire"></div></stats-row>
        <stats-row id="power-water"><div class="element-icon water"></div></stats-row>
        <stats-row id="power-earth"><div class="element-icon earth"></div></stats-row>
        <stats-row id="power-air"><div class="element-icon air"></div></stats-row>
    </div>
`

export class CharacterPowers extends HTMLComponent {
    constructor() {
        super(template)
    }

    update() {
        const { battler } = getState()

        this.getElement<StatsRow>("#power-fire").update("fire", battler.stats.firePower, "fire_power_description")
        this.getElement<StatsRow>("#power-water").update("water", battler.stats.waterPower, "water_power_description")
        this.getElement<StatsRow>("#power-earth").update("earth", battler.stats.earthPower, "earth_power_description")
        this.getElement<StatsRow>("#power-air").update("air", battler.stats.airPower, "air_power_description")
    }
}

customElements.define("character-powers", CharacterPowers)
