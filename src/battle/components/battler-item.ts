import { AbilityConfigs } from "../../config/AbilityConfigs"
import { HTMLComponent, toggleClassName } from "../../dom"
import { getState } from "../../state"
import { AbilityId, Battler, BattlerId } from "../../types"
import { addChild } from "./../../dom"

export function updateBattler(battler: Battler) {
    const element = document.getElementById(`battler:${battler.id}`) as BattlerItem
    element.update(battler)
}

export function loadBattler(battler: Battler) {
    const element = document.createElement("battler-item") as BattlerItem
    element.id = `battler:${battler.id}`
    element.update(battler)

    if (battler.isTeamA) {
        addChild("battle-column-a", element)
    } else {
        addChild("battle-column-b", element)
    }
}

export function toggleBattlerForward(battlerId: BattlerId, enable: boolean) {
    const battler = findBattler(battlerId)

    toggleClassName(`battler:${battlerId}`, battler.isTeamA ? "forward_bottom" : "forward_top", enable)
}

export function showBattlerAbility(battlerId: BattlerId, abilityId?: AbilityId) {
    const battlerElement = document.getElementById(`battler:${battlerId}`) as BattlerItem | null
    if (!battlerElement) {
        console.error(`Could not find battler with id: ${battlerId}`)
        return
    }

    const battler = findBattler(battlerId)

    battlerElement.update(battler, abilityId)
}

function findBattler(battlerId: BattlerId) {
    const { battle } = getState()

    let battler = battle.battlersA.find((entry) => entry.id === battlerId)
    if (!battler) {
        battler = battle.battlersB.find((entry) => entry.id === battlerId)
    }
    if (!battler) {
        throw `Could not find battler: ${battlerId}`
    }

    return battler
}

class BattlerItem extends HTMLComponent {
    constructor() {
        super(template)
    }

    update(battler: Battler, abilityId?: AbilityId) {
        this.getElement("#name").innerText = battler.name
        this.getElement("#level").innerText = String(battler.level)
        this.getElement("progress-bar").setAttribute("value", `${battler.hp}`)
        this.getElement("progress-bar").setAttribute("value-max", `${battler.hpMax}`)

        toggleClassName("cast-bar", "hide", !abilityId, this)

        if (abilityId) {
            const abilityConfig = AbilityConfigs[abilityId]

            this.getElement("#ability-name").innerText = abilityConfig.name
            this.getElement("#ability-icon").setAttribute("src", `assets/icon/skill/${abilityId}.png`)
        }
    }
}

customElements.define("battler-item", BattlerItem)

const template = document.createElement("template")
template.innerHTML = html`<style>
        :host {
            display: flex;
            flex-direction: row;
            width: 110px;
            border-radius: 3px;
            transition: transform 0.2s ease;

            position: relative;
            display: flex;
            flex-direction: column;
            flex: 1;
            margin: 2px 2px;
            background-color: #000;
            border: 2px solid #000;
            border-radius: 3px;
            color: #fff;
            transition: transform 0.2s ease;
            cursor: pointer;
        }
        :host(:hover) {
            background-color: #fff;
            color: #000;
            border: 2px solid #333;
        }

        &.inactive {
            opacity: 0.5;
            pointer-events: none;
        }
        :host(.forward_top) {
            background-color: white;
            color: black;
            transform: translate(0, 10px);
        }
        :host(.forward_bottom) {
            background-color: white;
            color: black;
            transform: translate(0, -10px);
        }
        :host(.shake) {
            animation-name: battler-shake;
            animation-duration: 0.2s;
            animation-iteration-count: 1;
        }

        .container {
            display: flex;
            flex-direction: column;
            flex: 1;
        }
        .frame {
            display: flex;
            flex-direction: column;
            flex: 1;
        }
        .row {
            display: flex;
            flex-direction: row;
            flex: 1;
            padding: 2px;
        }
        .hide {
            display: none;
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
            width: 110%;
            left: -5%;
            bottom: 40px;
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
        <div class="frame">
            <div class="row">
                <div id="level"></div>
                <div id="name"></div>
            </div>
            <progress-bar value="10" value-max="30"></progress-bar>
        </div>
    </div>`
