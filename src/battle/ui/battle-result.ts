import { HTMLComponent } from "../../dom"
import { i18n } from "../../i18n"
import { ItemSlotType } from "../../inventory/item-types"
import { getState } from "../../state"
import { ItemIconSlot } from "../../inventory/ui/item-icon-slot"
import { ItemSlot } from "./../../inventory/ui/item-slot"

const template = document.createElement("template")
template.innerHTML = html`
    <div class="flex flex-row align-items-center">
        <div id="result" class="bold uppercase"></div>
    </div>

    <div class="flex flex-row align-items-center">
        <div class="bold">${i18n("exp")}:</div>
        <div id="exp"></div>
    </div>
    <div class="flex flex-row align-items-center">
        <img src="/assets/icon/currency/gold.png" />
        <div id="gold"></div>
    </div>

    <inventory-container id="loot"></inventory-container>

    <x-button class="black">${i18n("continue")}</x-button>
`

export class BattleResultElement extends HTMLComponent {
    constructor() {
        super(template)
    }

    update() {
        const { battleResult } = getState()
        if (!battleResult) {
            return
        }

        this.setText("#result", battleResult.isVictory ? "Victory!" : "Defeat!")
        this.setText("#exp", battleResult.exp)
        this.setText("#gold", battleResult.gold)

        const lootContainer = this.getElement("#loot", true)

        battleResult.loot.sort((a, b) => {
            if (a.rarity === b.rarity) {
                return b.power - a.power
            }

            return b.rarity - a.rarity
        })

        for (const item of battleResult.loot) {
            const itemSlot = new ItemIconSlot()
            itemSlot.setAttribute("uid", item.uid)
            itemSlot.setAttribute("slot-type", ItemSlotType.BattleResult)
            itemSlot.updateByItem(item)
            lootContainer.appendChild(itemSlot)
        }
    }
}

customElements.define("battle-result", BattleResultElement)
