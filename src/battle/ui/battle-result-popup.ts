import { HTMLComponent } from "../../dom"
import { i18n } from "../../i18n"
import { ItemSlotType } from "../../inventory/item-types"
import { ItemIconSlot } from "../../inventory/ui/item-icon-slot"
import { getState } from "../../state"
import { PopupService } from "./../../popup"

const template = document.createElement("template")
template.setAttribute("class", "popup")
template.innerHTML = html`
    <div class="flex flex-column align-center sb-2">
        <div id="result" class="bold uppercase font-8 "></div>

        <div class="uppercase color-secondary text-center border-bottom width-60 pb-1">Rewards</div>

        <div id="loot-container" class="width-100"><div id="loot" class="justify-center item-slot-grid"></div></div>
        <div id="none" class="uppercase color-gray">None</div>

        <div><div id="continue" class="button m-2">${i18n("continue")}</div></div>
    </div>
`

export class BattleResultPopup extends HTMLComponent {
    constructor() {
        super(template)
    }

    connectedCallback() {
        super.connectedCallback()

        this.getElement("#continue").addEventListener("click", PopupService.close)
        this.update()
    }

    update() {
        const { battleResult } = getState()
        if (!battleResult) {
            return
        }

        const haveLoot = battleResult.loot.length > 0 || battleResult.xp > 0 || battleResult.gold > 0

        const lootContainer = this.getElement("#loot", true)

        this.setText("#result", battleResult.isVictory ? "Victory!" : "Defeat!")
        this.toggleClass("#loot-container", "hidden", !haveLoot)
        this.toggleClass("#none", "hidden", haveLoot)

        if (haveLoot) {
            battleResult.loot.sort((a, b) => {
                if (a.rarity === b.rarity) {
                    return b.power - a.power
                }

                return b.rarity - a.rarity
            })

            if (battleResult.xp > 0) {
                const xpSlot = new ItemIconSlot()
                xpSlot.setAttrib("item-id", "xp")
                xpSlot.setAttrib("amount", battleResult.xp)
                xpSlot.updateByItemId("xp", battleResult.xp)
                lootContainer.appendChild(xpSlot)
            }

            if (battleResult.gold > 0) {
                const goldSlot = new ItemIconSlot()
                goldSlot.setAttrib("item-id", "gold")
                goldSlot.setAttrib("amount", battleResult.gold)
                goldSlot.updateByItemId("gold", battleResult.gold)
                lootContainer.appendChild(goldSlot)
            }

            for (const item of battleResult.loot) {
                const itemSlot = new ItemIconSlot()
                itemSlot.setAttrib("uid", item.uid)
                itemSlot.setAttrib("slot-type", ItemSlotType.BattleResult)
                itemSlot.updateByItem(item)
                lootContainer.appendChild(itemSlot)
            }
        }
    }
}

customElements.define("battle-result-popup", BattleResultPopup)
