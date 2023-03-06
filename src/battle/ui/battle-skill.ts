import { InstantSkillConfig, SkillConfigs, SkillFlag } from "../../config/skill-configs"
import { HTMLComponent } from "../../dom"
import { LoadoutSkill } from "../../loadout/loadout-types"
import { getEnergyNeeded, getSkillIconPath } from "../../skills/skills-utils"
import { getState } from "../../state"
import { selectSkill } from "../battle-service"

export class BattlerSkill extends HTMLComponent {
    ability: LoadoutSkill

    constructor() {
        super(template)
    }

    setup(ability: LoadoutSkill) {
        this.ability = ability

        this.getElement("img").setAttribute("src", getSkillIconPath(ability.id))

        const abilityConfig = SkillConfigs[ability.id] as InstantSkillConfig
        if (abilityConfig.energy > 0) {
            this.setText("#energy", getEnergyNeeded(ability))
        }

        this.toggleClassName(abilityConfig.element, true, "#element")

        this.onclick = () => {
            selectSkill(ability)
        }

        this.update()
    }

    update() {
        const { battle, battler } = getState()

        const cooldown = this.ability.cooldown - (battle.turn - 1)
        const isInactive = cooldown === 0 && battle.status === "waiting" && battler.mana < getEnergyNeeded(this.ability)

        this.toggleClassName("selected", battle.status === "waiting" && battle.selectedSkill?.id === this.ability.id)
        this.toggleClassName("inactive", isInactive)

        this.toggleClassName("hide", cooldown <= 0, "#cooldown")
        this.toggleClassName("hide", cooldown > 0, "#energy")
        this.setText("#cooldown", cooldown)
    }
}

customElements.define("battler-skill", BattlerSkill)

const template = document.createElement("template")
template.innerHTML = html`
    <img />
    <div id="cooldown" class="cooldown"></div>
    <div id="energy" class="energy"></div>
    <div id="element" class="absolute left-px bottom-px element-icon"></div>
`
