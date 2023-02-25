import { HTMLComponent } from "../../dom"
import { i18n } from "../../i18n"
import { getState } from "../../state"
import { StatsRow } from "./stats-row"

const template = document.createElement("template")
template.className = "mb-3 width-180px"
template.innerHTML = html`
    <div class="mb-2 px-2 bold font-2">${i18n("resistances")}</div>
    <div class="highlight-row">
        <stats-row id="resistance-fire"><div class="element-icon fire mr-1"></div></stats-row>
        <stats-row id="resistance-water"><div class="element-icon water mr-1"></div></stats-row>
        <stats-row id="resistance-earth"><div class="element-icon earth mr-1"></div></stats-row>
        <stats-row id="resistance-air"><div class="element-icon air mr-1"></div></stats-row>
    </div>
`

export class CharacterResistances extends HTMLComponent {
    constructor() {
        super(template)
    }

    update() {
        const { battler } = getState()

        this.getElement<StatsRow>("#resistance-fire").update("fire", battler.stats.fireResistance, "fire_resistance_description", "%")
        this.getElement<StatsRow>("#resistance-water").update("water", battler.stats.waterResistance, "water_resistance_description", "%")
        this.getElement<StatsRow>("#resistance-earth").update("earth", battler.stats.earthResistance, "earth_resistance_description", "%")
        this.getElement<StatsRow>("#resistance-air").update("air", battler.stats.airResistance, "air_resistance_description", "%")
    }
}

customElements.define("character-resistances", CharacterResistances)
