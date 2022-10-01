import { getEnergyNeeded } from "../../abilities/abilities-utils"
import { getAbilityDescription } from "../../abilities/ui/abilities-view"
import { Ability } from "../../abilities/ability-type"
import { AbilityConfigs, AbilityFlag } from "../../config/ability-configs"
import { getElement, HTMLComponent, setHTML, toggleClassName } from "../../dom"
import { i18n } from "../../local"
import { getState } from "../../state"
import { selectAbility } from "../battle"
import { InstantAbilityConfig } from "./../../config/ability-configs"
import { toggleTeamInactive } from "./battler-item"
import { LoadoutAbility } from "./../../loadout/loadout-types"

export function loadAbilities() {
    const { loadout } = getState()

    const parent = getElement("battle-abilities")

    for (const loadoutAbility of loadout.abilities) {
        if (!loadoutAbility) {
            continue
        }

        const element = document.createElement("battler-ability-slot") as BattlerAbilitySlot
        element.setup(loadoutAbility)
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
    if (abilityConfig.flags & AbilityFlag.Offensive) {
        return !isTeamA
    }

    return isTeamA
}

const defaultLoadoutAbility: LoadoutAbility = {
    id: "attack",
    rank: 0,
    cooldown: 0,
}

class BattlerAbilitySlot extends HTMLComponent {
    ability: LoadoutAbility = defaultLoadoutAbility

    constructor() {
        super(template)
    }

    setup(ability: LoadoutAbility) {
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

        const cooldown = this.ability.cooldown - (battle.turn - 1)
        const isInactive = cooldown === 0 && battle.status === "waiting" && battler.energy < getEnergyNeeded(this.ability)

        this.toggleClassName("selected", battle.status === "waiting" && battle.selectedAbility?.id === this.ability.id)
        this.toggleClassName("inactive", isInactive)

        this.toggleClassName("hide", cooldown <= 0, "#cooldown")
        this.toggleClassName("hide", cooldown > 0, "#energy")
        this.setText("#cooldown", cooldown)
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

        #cooldown {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background: #000000ad;
            display: flex;
            justify-content: center;
            align-items: center;
            color: white;
            font-size: 22px;
            font-weight: bold;
            pointer-events: none;
        }

        #energy {
            position: absolute;
            padding: 0 1px 0 2px;
            right: 0;
            bottom: 0;
            background: #000;
            color: #fff;
            font-size: 10px;
            border-top-left-radius: 3px;
        }

        .hide {
            display: none !important;
        }
    </style>

    <img />
    <div id="cooldown"></div>
    <div id="energy"></div>`
