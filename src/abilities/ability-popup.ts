import { AbilityConfigs } from "../config/ability-configs"
import { HTMLComponent } from "../dom"
import { i18n } from "../local"
import { getState } from "../state"
import { AbilityId } from "../types"
import { getAbilityDescription } from "./abilities-view"
import { haveCurrency } from "./../currencies/currencies"

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
            <ability-slot inactive></ability-slot>
            <x-column class="center-v flex margin5">
                <x-text id="name" class="semibold line16"></x-text>
                <x-text id="type" class="tertiary">Passive</x-text>
            </x-column>

            <x-column class="center-v">
                <x-row class="center-v">
                    <x-text class="bold size22" id="rank"></x-text>
                    <rank>Rank</rank>
                </x-row>
            </x-column>
        </x-row>

        <div id="description"></div>
        <x-column class="center-h"><x-icon icon="fa-angle-down"></x-icon></x-column>
        <div id="description2"></div>
        <stats-table></stats-table>

        <x-row class="center-h" id="actions"><x-button class="black">Learn</x-button></x-row>
    </popup-container>`

export class AbilityPopup extends HTMLComponent {
    constructor() {
        super(template)
    }

    connectedCallback() {
        this.update()
    }

    update() {
        const abilityId = this.getAttribute("ability-id")
        if (!abilityId) {
            return
        }

        const { abilities } = getState()
        const ability = abilities.find((entry) => entry.id === abilityId)
        const abilityRank = ability ? ability.rank : 1
        this.setText("#rank", abilityRank)

        const abilitySlot = this.getElement("ability-slot")
        abilitySlot.setAttribute("ability-id", abilityId)

        const abilityConfig = AbilityConfigs[abilityId as AbilityId]
        this.setText("#name", i18n(abilityId))
        // this.setText("#type", i18n(abilityConfig.type))
        // this.setText("#power", itemPower)

        const description = getAbilityDescription(abilityConfig, abilityRank)
        const description2 = getAbilityDescription(abilityConfig, abilityRank + 1)
        this.setHTML("#description", description)
        this.setHTML("#description2", description2)

        const haveAp = haveCurrency("ap", 1)
        this.toggleClassName("disabled", !haveAp, "x-button")

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
