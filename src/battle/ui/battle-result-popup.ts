import { HTMLComponent } from "../../dom"
import { i18n } from "../../i18n"
import { ItemSlotType } from "../../inventory/item-types"
import { ItemIconSlot } from "../../inventory/ui/item-icon-slot"
import { getState } from "../../state"

const template = document.createElement("template")
template.setAttribute("class", "popup")
template.innerHTML = html`
    <div class="flex flex-column align-center sb-2">
        <div id="result" class="bold uppercase font-2 "></div>

        <div class="uppercase color-secondary text-center border-bottom width-60 pb-1">Rewards</div>

        <div id="loot" class="flex align-center sr-1"></div>

        <div><x-button class="black m-2">${i18n("continue")}</x-button></div>
    </div>
`

export class BattleResultPopup extends HTMLComponent {
    constructor() {
        super(template)
    }

    connectedCallback() {
        super.connectedCallback()

        this.update()
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

customElements.define("battle-result-popup", BattleResultPopup)
