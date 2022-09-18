import { HTMLComponent } from "../../dom"
import { openItemPopup } from "../../inventory/ui/inventory-view"
import { closePopup } from "../../popup"
import { getState } from "../../state"
import { i18n } from "./../../local"

const template = document.createElement("template")
template.innerHTML = html`<popup-container>
        <x-row class="center-h">
            <x-text id="result" class="header size30"></x-text>
        </x-row>

        <x-row class="center-h padding10">
            <x-text class="bold">${i18n("exp")}: </x-text>
            <x-text id="exp"></x-text>
        </x-row>

        <inventory-container id="loot"></inventory-container>

        <x-row class="center-h">
            <close-button></close-button>
        </x-row>
    </popup-container>

    <style>
        inventory-container {
            display: flex;
            flex-direction: row;
        }
        inventory-container > * {
            margin: 3px;
        }
    </style>`

export class BattleResultPopup extends HTMLComponent {
    constructor() {
        super(template)

        const { battleResult } = getState()

        this.getElement("close-button").onclick = closePopup

        if (!battleResult) {
            return
        }

        this.setText("#result", battleResult.isVictory ? "Victory!" : "Defeat!")
        this.setText("#exp", battleResult.exp)

        const lootContainer = this.getElement("#loot")

        for (const loot of battleResult.loot) {
            const itemSlot = document.createElement("item-slot")
            itemSlot.setAttribute("item-id", loot.id)
            itemSlot.setAttribute("amount", String(loot.amount))
            itemSlot.onclick = openItemPopup
            lootContainer.appendChild(itemSlot)
        }
    }
}

customElements.define("battle-result-popup", BattleResultPopup)
