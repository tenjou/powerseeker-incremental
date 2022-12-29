import { HTMLComponent } from "../../dom"
import { openItemPopup } from "../../inventory/ui/inventory-view"
import { getState } from "../../state"
import { handeMouseMoveTooltip } from "../../tooltip"
import { i18n } from "../../i18n"

const template = document.createElement("template")
template.innerHTML = html`
    <popup-container>
        <x-row class="center-h">
            <x-text id="result" class="header size30"></x-text>
        </x-row>

        <x-row class="center-h">
            <x-text class="bold">${i18n("exp")}:</x-text>
            <x-text id="exp"></x-text>
        </x-row>
        <x-row class="center-h">
            <img src="/assets/icon/currency/gold.png" />
            <x-text id="gold"></x-text>
        </x-row>

        <inventory-container id="loot"></inventory-container>
    </popup-container>

    <style>
        inventory-container {
            display: flex;
            flex-direction: row;
        }
        inventory-container > * {
            margin: 3px;
        }
    </style>
`

export class BattleResultPopup extends HTMLComponent {
    constructor() {
        super(template)

        const { battleResult } = getState()
        if (!battleResult) {
            return
        }

        this.setText("#result", battleResult.isVictory ? "Victory!" : "Defeat!")
        this.setText("#exp", battleResult.exp)
        this.setText("#gold", battleResult.gold)

        const lootContainer = this.getElement("#loot")
        lootContainer.onmousemove = handeMouseMoveTooltip

        for (const loot of battleResult.loot) {
            const itemSlot = document.createElement("item-slot")
            itemSlot.setAttribute("item-id", loot.id)
            itemSlot.setAttribute("amount", String(loot.amount))
            itemSlot.setAttribute("power", String(loot.power))
            itemSlot.setAttribute("rarity", String(loot.rarity))
            itemSlot.onclick = openItemPopup

            lootContainer.appendChild(itemSlot)
        }
    }
}

customElements.define("battle-result-popup", BattleResultPopup)
