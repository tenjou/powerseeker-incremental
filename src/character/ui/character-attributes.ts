import { HTMLComponent } from "../../dom"
import { i18n } from "../../i18n"
import { getState } from "../../state"
import { StatsRow } from "./stats-row"

export interface StatsRowEntry {
    key: string
    value: number | string
}

const template = document.createElement("template")
template.className = "mb-3 mr-3 width-180px"
template.innerHTML = html`
    <div class="px-2 mb-1 bold font-2">${i18n("attributes")}</div>
    <div class="highlight-row">
        <stats-row id="attribute-health"></stats-row>
        <stats-row id="attribute-mana"></stats-row>
        <stats-row id="attribute-health-regen"></stats-row>
        <stats-row id="attribute-mana-regen"></stats-row>
    </div>
    <div class="highlight-row">
        <stats-row id="attribute-attack"></stats-row>
        <stats-row id="attribute-defense"></stats-row>
        <stats-row id="attribute-healing"></stats-row>
        <stats-row id="attribute-accuracy"></stats-row>
        <stats-row id="attribute-evasion"></stats-row>
        <stats-row id="attribute-critical"></stats-row>
        <stats-row id="attribute-speed"></stats-row>
    </div>
`

export class CharacterAttributes extends HTMLComponent {
    constructor() {
        super(template)
    }

    update() {
        const { battler } = getState()

        this.getElement<StatsRow>("#attribute-health").update("health", battler.stats.health)
        this.getElement<StatsRow>("#attribute-mana").update("mana", battler.stats.mana)
        this.getElement<StatsRow>("#attribute-health-regen").update("health_regen", battler.stats.regenHealth)
        this.getElement<StatsRow>("#attribute-mana-regen").update("mana_regen", battler.stats.regenMana)

        this.getElement<StatsRow>("#attribute-attack").update("attack", battler.stats.attack)
        this.getElement<StatsRow>("#attribute-defense").update("defense", battler.stats.defense)
        this.getElement<StatsRow>("#attribute-healing").update("healing", battler.stats.healing)
        this.getElement<StatsRow>("#attribute-accuracy").update("accuracy", battler.stats.accuracy)
        this.getElement<StatsRow>("#attribute-evasion").update("evasion", battler.stats.evasion)
        this.getElement<StatsRow>("#attribute-critical").update("critical", battler.stats.critical)
        this.getElement<StatsRow>("#attribute-speed").update("speed", battler.stats.speed)
    }
}

customElements.define("character-attributes", CharacterAttributes)
