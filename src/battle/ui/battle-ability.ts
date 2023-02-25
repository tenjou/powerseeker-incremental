import { getEnergyNeeded } from "../../abilities/abilities-utils"
import { getAbilityDescription } from "../../abilities/ui/abilities-view"
import { AbilityConfigs, AbilityFlag } from "../../config/ability-configs"
import { getElementById, HTMLComponent, setHTML, toggleClassName } from "../../dom"
import { i18n } from "../../i18n"
import { getState } from "../../state"
import { selectAbility } from "../battle-service"
import { InstantAbilityConfig } from "./../../config/ability-configs"
import { LoadoutAbility } from "./../../loadout/loadout-types"
import { toggleTeamInactive } from "./battler-item"

export function loadAbilities() {
    const { loadout } = getState()

    const parent = getElementById("battle-abilities")

    for (const loadoutAbility of loadout.abilities) {
        if (!loadoutAbility) {
            continue
        }

        const element = new BattlerAbilityElement()
        element.setup(loadoutAbility)
        parent.appendChild(element)
    }

    renderAbilities()
}

export function renderAbilities() {
    const { battle } = getState()

    const element = getElementById("battle-abilities")
    const children = element.children as unknown as BattlerAbilityElement[]

    toggleClassName("battle-abilities", "inactive", battle.status !== "waiting")

    for (let n = 0; n < children.length; n += 1) {
        const child = children[n]
        child.update()
    }

    if (battle.selectedAbility) {
        const abilityConfig = AbilityConfigs[battle.selectedAbility.id] as InstantAbilityConfig
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

function canTargetTeamA(abilityConfig: InstantAbilityConfig, isTeamA: boolean) {
    if (abilityConfig.flags & AbilityFlag.Offensive) {
        return !isTeamA
    }

    return isTeamA
}

const iconMapping: Record<string, string> = {
    fire_attack: "attack",
    water_attack: "attack",
    earth_attack: "attack",
    air_attack: "attack",
}

class BattlerAbilityElement extends HTMLComponent {
    ability: LoadoutAbility

    constructor() {
        super(template)
    }

    setup(ability: LoadoutAbility) {
        this.ability = ability

        const abilityConfig = AbilityConfigs[ability.id] as InstantAbilityConfig
        const iconId = iconMapping[ability.id] || ability.id

        this.getElement("img").setAttribute("src", `/assets/icon/ability/${iconId}.png`)

        if (abilityConfig.energy > 0) {
            this.setText("#energy", getEnergyNeeded(ability))
        }

        this.onclick = () => {
            selectAbility(ability)
        }

        this.update()
    }

    update() {
        const { battle, battler } = getState()

        const cooldown = this.ability.cooldown - (battle.turn - 1)
        const isInactive = cooldown === 0 && battle.status === "waiting" && battler.mana < getEnergyNeeded(this.ability)

        this.toggleClassName("selected", battle.status === "waiting" && battle.selectedAbility?.id === this.ability.id)
        this.toggleClassName("inactive", isInactive)

        this.toggleClassName("hide", cooldown <= 0, "#cooldown")
        this.toggleClassName("hide", cooldown > 0, "#energy")
        this.setText("#cooldown", cooldown)
    }
}

customElements.define("battler-ability", BattlerAbilityElement)

const template = document.createElement("template")
template.innerHTML = html`
    <img />
    <div id="cooldown" class="cooldown"></div>
    <div id="energy" class="energy"></div>
`
