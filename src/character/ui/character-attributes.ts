import { HTMLComponent } from "../../dom"
import { i18n } from "../../i18n"
import { getState } from "../../state"
import { StatsRow } from "./stats-row"

const template = document.createElement("template")
template.className = "mb-3 mr-3 width-180px"
template.innerHTML = html`
    <div class="px-2 mb-2 bold font-2">${i18n("attributes")}</div>

    <div class="highlight-row">
        <stats-row id="attribute-health"></stats-row>
        <stats-row id="attribute-mana"></stats-row>
        <stats-row id="attribute-health-regen"></stats-row>
        <stats-row id="attribute-mana-regen"></stats-row>
    </div>

    <div class="highlight-row">
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

        this.getElement<StatsRow>("#attribute-health").update("health", battler.stats.health, "health_description")
        this.getElement<StatsRow>("#attribute-mana").update("mana", battler.stats.mana, "mana_description")
        this.getElement<StatsRow>("#attribute-health-regen").update("health_regen", battler.stats.regenHealth, "health_regen_description")
        this.getElement<StatsRow>("#attribute-mana-regen").update("mana_regen", battler.stats.regenMana, "mana_regen_description")
        this.getElement<StatsRow>("#attribute-accuracy").update("accuracy", battler.stats.accuracy, "accuracy_description")
        this.getElement<StatsRow>("#attribute-evasion").update("evasion", battler.stats.evasion, "evasion_description")
        this.getElement<StatsRow>("#attribute-critical").update("critical", battler.stats.critical, "critical_description")
        this.getElement<StatsRow>("#attribute-speed").update("speed", battler.stats.speed, "speed_description")
    }
}

customElements.define("character-attributes", CharacterAttributes)
