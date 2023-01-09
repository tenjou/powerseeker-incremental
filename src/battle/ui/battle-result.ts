import { HTMLComponent } from "../../dom"
import { i18n } from "../../i18n"
import { ItemSlotType } from "../../inventory/item-types"
import { ItemIconSlot } from "../../inventory/ui/item-icon-slot"
import { getState } from "../../state"

const template = document.createElement("template")
template.innerHTML = html`
    <div class="flex flex-row align-center">
        <div id="result" class="bold uppercase"></div>
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

        const lootContainer = this.getElement("#loot", true)

        battleResult.loot.sort((a, b) => {
            if (a.rarity === b.rarity) {
                return b.power - a.power
            }

            return b.rarity - a.rarity
        })

        const xpSlot = new ItemIconSlot()
        xpSlot.setAttrib("item-id", "xp")
        xpSlot.setAttrib("amount", battleResult.xp)
        xpSlot.updateByItemId("xp", battleResult.xp)
        lootContainer.appendChild(xpSlot)

        const goldSlot = new ItemIconSlot()
        goldSlot.setAttrib("item-id", "gold")
        goldSlot.setAttrib("amount", battleResult.gold)
        goldSlot.updateByItemId("gold", battleResult.gold)
        lootContainer.appendChild(goldSlot)

        for (const item of battleResult.loot) {
            const itemSlot = new ItemIconSlot()
            itemSlot.setAttrib("uid", item.uid)
            itemSlot.setAttrib("slot-type", ItemSlotType.BattleResult)
            itemSlot.updateByItem(item)
            lootContainer.appendChild(itemSlot)
        }
    }
}

customElements.define("battle-result", BattleResultElement)
