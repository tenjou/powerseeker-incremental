import { getEnergyNeeded } from "../../abilities/abilities-utils"
import { getAbilityDescription } from "../../abilities/ui/abilities-view"
import { Ability } from "../../abilities/ability-type"
import { AbilityConfigs } from "../../config/ability-configs"
import { getElement, HTMLComponent, setHTML, toggleClassName } from "../../dom"
import { i18n } from "../../local"
import { getState } from "../../state"
import { selectAbility } from "../battle"
import { InstantAbilityConfig } from "./../../config/ability-configs"
import { toggleTeamInactive } from "./battler-item"

export function loadAbilities() {
    const { abilities, loadout } = getState()

    const parent = getElement("battle-abilities")

    for (const abilityId of loadout.abilities) {
        if (!abilityId) {
            continue
        }

        const ability = abilities[abilityId]
        if (!ability) {
            continue
        }

        const element = document.createElement("battler-ability-slot") as BattlerAbilitySlot
        element.setup(ability)
        parent.appendChild(element)
    }
}

export function renderAbilities() {
    const { battle } = getState()

    const element = getElement("battle-abilities")
    const children = element.children as unknown as BattlerAbilitySlot[]

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
    if (abilityConfig.isOffensive) {
        return !isTeamA
    }

    return isTeamA
}

class BattlerAbilitySlot extends HTMLComponent {
    ability: Ability

    constructor() {
        super(template)

        this.ability = {
            id: "attack",
            rank: 0,
        }
    }

    setup(ability: Ability) {
        this.ability = ability

        const abilityConfig = AbilityConfigs[ability.id] as InstantAbilityConfig

        this.getElement("img").setAttribute("src", `assets/icon/ability/${ability.id}.png`)
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

        this.toggleClassName("selected", battle.status === "waiting" && battle.selectedAbility?.id === this.ability.id)
        this.toggleClassName("inactive", battle.status === "waiting" && battler.energy < getEnergyNeeded(this.ability))
    }
}

customElements.define("battler-ability-slot", BattlerAbilitySlot)

const template = document.createElement("template")
template.innerHTML = html`<style>
        :host {
            position: relative;
            padding: 4px;
            margin: 0 3px;
            border: 2px solid #000;
            border-radius: 3px;
            cursor: pointer;
            background: linear-gradient(#dad8d8, #c3c2c2);
            box-shadow: 0 0 2px #696969;
        }
        :host > img {
            display: block;
            zoom: 2;
            image-rendering: pixelated;
        }
        :host(:hover),
        :host(.selected) {
            border: 2px solid #fff;
        }
        :host(:active) {
            transform: translateY(1px);
        }
        :host(.inactive) {
            opacity: 0.5;
            pointer-events: none;
        }

        div {
            position: absolute;
            padding: 0 1px 0 2px;
            right: 0;
            bottom: 0;
            background: #000;
            color: #fff;
            font-size: 10px;
            border-top-left-radius: 3px;
        }
    </style>

    <img />
    <div id="energy"></div>`
