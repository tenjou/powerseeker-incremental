import { AbilityConfigs, AbilityId } from "../../config/ability-configs"
import { HTMLComponent } from "../../dom"
import { i18n } from "../../local"
import { getState } from "../../state"
import { haveCurrency } from "../../currencies/currencies"
import { subscribe, unsubscribe } from "../../events"
import { getRequiredAp, learnAbility } from "../abilities-utils"
import { getAbilityDescription } from "./abilities-view"

const template = document.createElement("template")
template.innerHTML = html`<style>
        rank {
            margin-left: 3px;
            margin-right: 4px;
            text-transform: uppercase;
            font-weight: 600;
            font-size: 9px;
            color: #8f8f8f;
        }

        #description {
            margin: 8px 0 12px 0;
            padding-top: 6px;
        }
        #description2 {
            margin: 8px 0 12px 0;
            padding-top: 6px;
        }

        semibold {
            font-weight: 600;
        }
    </style>

    <popup-container>
        <x-row>
            <ability-slot inactive hide-rank></ability-slot>
            <x-column class="center-v flex margin5">
                <x-text id="name" class="semibold line16"></x-text>
                <x-text id="type" class="tertiary">Passive</x-text>
            </x-column>

            <x-column class="center-v">
                <x-row class="center-v">
                    <currency-item currency="ap" need="" />
                </x-row>
            </x-column>
        </x-row>

        <div id="description"><rank>Rank 1</rank><x-text></x-text></div>
        <x-column class="center-h"><x-icon icon="fa-angle-down"></x-icon></x-column>
        <div id="description2"><rank>Rank 2</rank><x-text></x-text></div>
        <stats-table></stats-table>

        <x-row class="center-h" id="actions"><x-button class="black">Learn</x-button></x-row>
    </popup-container>`

export class AbilityPopup extends HTMLComponent {
    updateCallback: () => void

    constructor() {
        super(template)

        this.updateCallback = () => this.update()
    }

    connectedCallback() {
        this.update()

        this.getElement("x-button").onclick = () => {
            const abilityId = this.getAttribute("ability-id") as AbilityId | null
            if (!abilityId) {
                return
            }

            learnAbility(abilityId)
        }

        subscribe("ability-updated", this.updateCallback)
    }

    disconnectedCallback() {
        unsubscribe("ability-updated", this.updateCallback)
    }

    update() {
        const abilityId = this.getAttribute("ability-id") as AbilityId | null
        if (!abilityId) {
            return
        }

        const { abilities } = getState()
        const ability = abilities[abilityId]
        const abilityRank = ability ? ability.rank : 1
        // this.setText("#rank", abilityRank)

        const abilitySlot = this.getElement("ability-slot")
        abilitySlot.setAttribute("ability-id", abilityId)

        const abilityConfig = AbilityConfigs[abilityId as AbilityId]
        this.setText("#name", i18n(abilityId))
        // this.setText("#type", i18n(abilityConfig.type))
        // this.setText("#power", itemPower)

        const description = getAbilityDescription(abilityConfig, abilityRank)
        const description2 = getAbilityDescription(abilityConfig, abilityRank + 1)
        this.setHTML("#description x-text", description)
        this.setHTML("#description2 x-text", description2)

        const needAp = getRequiredAp(abilityId)
        const haveAp = haveCurrency("ap", needAp)
        this.toggleClassName("disabled", !haveAp, "x-button")
        this.getElement("currency-item").setAttribute("need", String(needAp))

        // if (abilityConfig.type === "armor") {
        //     const xAttribute = this.getElement("stats-table")
        //     const data = abilityConfig.stats.map<StatsTableEntry>((entry) => {
        //         return {
        //             key: i18n(entry.type),
        //             value: entry.value,
        //         }
        //     })
        //     xAttribute.setAttribute("data", JSON.stringify(data))
        // }
    }
}

customElements.define("ability-popup", AbilityPopup)
