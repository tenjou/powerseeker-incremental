import { ScrollingText } from "../../components/scrolling-text"
import { AbilityConfigs, AbilityId } from "../../config/ability-configs"
import { addChild, HTMLComponent, toggleClassName } from "../../dom"
import { i18n } from "../../local"
import { getState } from "../../state"
import { BattlerId } from "../../types"
import { clamp } from "../../utils"
import { useSelectedAbility } from "../battle"
import { Battler } from "../battle-types"
import "./battler-effect-element"
import { BattlerEffectElement } from "./battler-effect-element"

export function updateBattler(battler: Battler) {
    const element = document.getElementById(`battler:${battler.id}`) as BattlerItem
    element.update(battler.id)
}

export function loadBattler(battler: Battler) {
    const element = document.createElement("battler-item") as BattlerItem
    element.id = `battler:${battler.id}`
    element.update(battler.id)
    element.onclick = () => useSelectedAbility(battler.id)

    if (battler.isTeamA) {
        addChild("battle-column-a", element)
    } else {
        addChild("battle-column-b", element)
    }
}

export function toggleBattlerForward(battlerId: BattlerId, enable: boolean) {
    const { battle } = getState()

    const battler = battle.battlers[battlerId]

    toggleClassName(`battler:${battlerId}`, battler.isTeamA ? "forward_bottom" : "forward_top", enable)
}

export function toggleBattlerShake(battlerId: BattlerId, enable: boolean) {
    toggleClassName(`battler:${battlerId}`, "shake", enable)
}

export function toggleTeamInactive(isTeamA: boolean, inactive: boolean) {
    const teamElementId = `battle-column-${isTeamA ? "a" : "b"}`

    toggleClassName(teamElementId, "inactive", inactive)
}

export function toggleBattlerInactive(battlerId: BattlerId, inactive: boolean) {
    toggleClassName(`battler:${battlerId}`, "inactive", inactive)
}

export function addBattlerScrollingText(battlerId: BattlerId, text: string, color: string, icon: string | null) {
    const element = findBattlerElement(battlerId)
    element.addScrollingText(text, color, icon)
}

export function addBattlerHealth(battlerId: BattlerId, value: number) {
    const { battle } = getState()

    const battlerView = battle.battlersView[battlerId]
    battlerView.health += value
    battlerView.health = clamp(battlerView.health, 0, battlerView.healthMax)

    const element = findBattlerElement(battlerId)
    element.update(battlerId)
}

export function addBattlerEnergy(battlerId: BattlerId, value: number, abilityId?: AbilityId) {
    const { battle } = getState()

    const battlerView = battle.battlersView[battlerId]
    battlerView.energy += value
    battlerView.energy = clamp(battlerView.energy, 0, battlerView.energyMax)

    const element = findBattlerElement(battlerId)
    element.update(battlerId, abilityId)
}

export function addBattlerEffect(battlerId: BattlerId, effectId: number, abilityId: AbilityId, duration: number) {
    const { battle } = getState()

    const battlerView = battle.battlersView[battlerId]
    const prevEffect = battlerView.effects.find((entry) => entry.id === effectId)
    if (prevEffect) {
        prevEffect.duration = duration
    } else {
        battlerView.effects.push({
            id: effectId,
            abilityId,
            duration,
        })
    }

    const element = findBattlerElement(battlerId)
    element.updateEffects(battlerId)
}

export function removeBattlerEffect(battlerId: BattlerId, effectId: number) {
    const { battle } = getState()

    const battlerView = battle.battlersView[battlerId]
    const effectIndex = battlerView.effects.findIndex((entry) => entry.id === effectId)
    if (effectIndex === -1) {
        return
    }

    battlerView.effects.splice(effectIndex, 1)

    const element = findBattlerElement(battlerId)
    element.updateEffects(battlerId)
}

export function findBattlerElement(battlerId: BattlerId): BattlerItem {
    const element = document.getElementById(`battler:${battlerId}`) as BattlerItem | null
    if (!element) {
        throw `Could not find battler with id: ${battlerId}`
    }

    return element
}

export function updateBattlerEffects(battlerId: BattlerId) {
    const element = findBattlerElement(battlerId)
    element.updateEffects(battlerId)
}

class BattlerItem extends HTMLComponent {
    constructor() {
        super(template)
    }

    addScrollingText(text: string, color: string, icon: string | null) {
        const scrollingText = new ScrollingText()
        scrollingText.setup(text, color, icon)
        this.shadowRoot?.appendChild(scrollingText)
    }

    update(battlerId: BattlerId, abilityId?: AbilityId) {
        const { battle } = getState()

        const battler = battle.battlers[battlerId]
        const battlerView = battle.battlersView[battlerId]

        this.setText("#name", battler.name)
        this.setText("#level", battler.level)
        this.getElement("#health").setAttribute("value", `${battlerView.health}`)
        this.getElement("#health").setAttribute("value-max", `${battlerView.healthMax}`)
        this.getElement("#energy").setAttribute("value", `${battlerView.energy}`)
        this.getElement("#energy").setAttribute("value-max", `${battlerView.energyMax}`)

        this.toggleClassName("inactive", battlerView.health <= 0)

        this.toggleClassName("hide", !abilityId, "#cast-bar")
        this.toggleClassName("hide", !!abilityId, "#effects")

        if (abilityId) {
            const abilityConfig = AbilityConfigs[abilityId]

            this.getElement("#ability-name").innerText = i18n(abilityConfig.id)
            this.getElement("#ability-icon").setAttribute("src", `assets/icon/ability/${abilityId}.png`)
        }
    }

    updateEffects(battlerId: BattlerId) {
        const { battle } = getState()

        const battler = battle.battlersView[battlerId]
        const effects = battler.effects

        const effectsParent = this.getElement("#effects")

        if (effects.length > effectsParent.childElementCount) {
            const numMissing = effects.length - effectsParent.childElementCount
            for (let n = 0; n < numMissing; n += 1) {
                const effectElement = document.createElement("battler-effect") as BattlerEffectElement
                effectElement.update(effects[0])
                effectsParent.appendChild(effectElement)
            }
        }

        while (effects.length < effectsParent.childElementCount) {
            if (!effectsParent.lastChild) {
                console.error("Missing effects child to remove")
                return
            }
            effectsParent.removeChild(effectsParent.lastChild)
        }

        for (let n = 0; n < effects.length; n += 1) {
            const effect = effects[n]
            const child = effectsParent.children[n] as BattlerEffectElement
            child.update(effect)
        }
    }
}

customElements.define("battler-item", BattlerItem)

const template = document.createElement("template")
template.innerHTML = html`<style>
        :host {
            position: relative;
            display: flex;
            flex-direction: column;
            flex: 1;
            width: 110px;
            margin: 2px;
            padding-bottom: 1px;
            background-color: #000;
            border: 2px solid #000;
            border-radius: 3px;
            color: #fff;
            transition: transform 0.2s ease;
            cursor: pointer;
        }

        :host(.forward_top) {
            transform: translate(0, 10px);
        }
        :host(.forward_top) .row {
            background-color: white;
            color: black;
        }

        :host(.forward_bottom) {
            transform: translate(0, -10px);
        }
        :host(.forward_bottom) .row {
            background-color: white;
            color: black;
        }

        :host(.shake) {
            animation-name: battler-shake;
            animation-duration: 0.2s;
            animation-iteration-count: 1;
        }
        :host(.inactive) .container {
            opacity: 0.5;
            pointer-events: none;
        }
        :host-context(x-row.inactive) {
            opacity: 0.25;
            pointer-events: none;
        }

        :host(:hover) {
            outline: 3px solid white;
        }
        :host(:hover) .row {
            background-color: #fff;
            color: #000;
        }

        .container {
            display: flex;
            flex-direction: column;
            flex: 1;
        }
        .row {
            display: flex;
            flex-direction: row;
            flex: 1;
            padding: 2px 2px 1px 2px;
            margin-bottom: 2px;
        }
        .hide {
            display: none !important;
        }

        .frame {
            display: flex;
            flex-direction: column;
            flex: 1;
        }

        #level {
            display: flex;
            align-items: center;
            margin-right: 3px;
            padding-bottom: 2px;
            color: #bbb;
            font-size: 10px;
        }

        .skill-use {
            display: flex;
            flex-direction: column;
            width: 100%;
            height: 100%;
            margin-top: -1px;
            margin-bottom: -1px;
            justify-content: center;
            align-items: center;
            background: linear-gradient(to right, #0000, #26404c, #0000);
            border-radius: 10px;
        }
        .border {
            width: 100%;
            flex: 0 0 1px;
            background: linear-gradient(to right, #ff00, #000, #ff00);
        }

        #cast-bar {
            position: absolute;
            width: 100%;
            bottom: 56px;
        }
        .cast-bar-container {
            display: flex;
            flex-direction: column;
            width: 100%;
            margin-top: -1px;
            margin-bottom: -1px;
            justify-content: center;
            align-items: center;
            background: linear-gradient(to right, #0000, #26404c, #0000);
        }
        .cast-bar-row {
            display: flex;
            flex-direction: row;
            flex: 0 1 0%;
            justify-content: center;
            align-items: center;
        }
        #ability-name {
            padding: 4px;
            width: 100%;
            color: #fff;
            text-shadow: 0 0 2px black;
            text-align: center;
        }

        #energy {
            margin-top: 2px;
        }

        #effects {
            position: absolute;
            top: -22px;
            left: 0;
            width: 100%;
            display: flex;
            flex-direction: row;
            justify-content: center;
        }
    </style>

    <div class="container">
        <div id="cast-bar" class="hide">
            <div class="cast-bar-container">
                <div class="border"></div>
                <div class="cast-bar-row">
                    <img id="ability-icon" />
                    <div id="ability-name"></div>
                </div>
                <div class="border"></div>
            </div>
        </div>
        <div id="effects"></div>
        <div class="frame">
            <div class="row">
                <div id="level"></div>
                <div id="name"></div>
            </div>
            <progress-bar id="health" value="10" value-max="30"></progress-bar>
            <progress-bar id="energy" value="10" value-max="30" class="blue"></progress-bar>
        </div>
    </div>`
