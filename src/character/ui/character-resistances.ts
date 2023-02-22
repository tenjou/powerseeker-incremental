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
    <div class="mb-2 px-2 bold font-2">${i18n("resistances")}</div>
    <div class="highlight-row">
        <stats-row id="resistance-fire"><div class="resistance-icon fire"></div></stats-row>
        <stats-row id="resistance-water"><div class="resistance-icon water"></div></stats-row>
        <stats-row id="resistance-earth"><div class="resistance-icon earth"></div></stats-row>
        <stats-row id="resistance-air"><div class="resistance-icon air"></div></stats-row>
        <stats-row id="resistance-light"><div class="resistance-icon light"></div></stats-row>
        <stats-row id="resistance-dark"><div class="resistance-icon dark"></div></stats-row>
    </div>
`

export class CharacterResistances extends HTMLComponent {
    constructor() {
        super(template)
    }

    update() {
        const { battler } = getState()

        this.getElement<StatsRow>("#resistance-fire").update("fire_resistance", battler.stats.fireResistance, "%")
        this.getElement<StatsRow>("#resistance-water").update("water_resistance", battler.stats.waterResistance, "%")
        this.getElement<StatsRow>("#resistance-earth").update("earth_resistance", battler.stats.earthResistance, "%")
        this.getElement<StatsRow>("#resistance-air").update("air_resistance", battler.stats.airResistance, "%")
        this.getElement<StatsRow>("#resistance-light").update("light_resistance", battler.stats.lightResistance, "%")
        this.getElement<StatsRow>("#resistance-dark").update("dark_resistance", battler.stats.darkResistance, "%")
    }
}

customElements.define("character-resistances", CharacterResistances)
