import { SkillConfigs, SkillFlag } from "../../config/skill-configs"
import { getElement, getElementById, HTMLComponent, setHTML, toggleClassName } from "../../dom"
import { i18n } from "../../i18n"
import { getState } from "../../state"
import { selectSkill } from "../battle-service"
import { InstantSkillConfig } from "../../config/skill-configs"
import { LoadoutSkill } from "../../loadout/loadout-types"
import { toggleTeamInactive } from "./battler-item"
import { getSkillIconPath, getEnergyNeeded } from "../../skills/skills-utils"
import { getAbilityDescription } from "../../skills/ui/abilities-view"

export function loadAbilities() {
    const { loadout } = getState()

    const parent = getElementById("battle-abilities")

    for (const loadoutAbility of loadout.abilities) {
        if (!loadoutAbility) {
            continue
        }

        const element = new BattlerSkillElement()
        element.setup(loadoutAbility)
        parent.appendChild(element)
    }

    renderSkills()
}

export function renderSkills() {
    const { battle } = getState()

    const element = getElementById("battle-abilities")
    const children = element.children as unknown as BattlerSkillElement[]

    toggleClassName("battle-abilities", "inactive", battle.status !== "waiting")

    for (let n = 0; n < children.length; n += 1) {
        const child = children[n]
        child.update()
    }

    if (battle.selectedSkill) {
        const abilityConfig = SkillConfigs[battle.selectedSkill.id] as InstantSkillConfig
        const abilityTooltip = getAbilityDescription(abilityConfig)

        toggleClassName("battle-tooltip", "hide", false)
        setHTML("battle-tooltip-title", i18n(abilityConfig.id))
        setHTML("battle-tooltip-text", abilityTooltip)

        const abilityUsable = canTargetTeamA(abilityConfig, battle.isTeamA)
        toggleTeamInactive(!battle.isTeamA, abilityUsable)
        toggleTeamInactive(battle.isTeamA, !abilityUsable)
    } else {
        toggleClassName("battle-tooltip", "hide", true)
        toggleTeamInactive(true, false)
        toggleTeamInactive(false, false)
    }
}

function canTargetTeamA(abilityConfig: InstantSkillConfig, isTeamA: boolean) {
    if (abilityConfig.flags & SkillFlag.Offensive) {
        return !isTeamA
    }

    return isTeamA
}

class BattlerSkillElement extends HTMLComponent {
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

customElements.define("battler-skill", BattlerSkillElement)

const template = document.createElement("template")
template.innerHTML = html`
    <img />
    <div id="cooldown" class="cooldown"></div>
    <div id="energy" class="energy"></div>
    <div id="element" class="absolute left-px bottom-px element-icon"></div>
`
