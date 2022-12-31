import { HTMLComponent } from "../../dom"
import { i18n } from "../../i18n"
import { getState } from "../../state"

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

class BattleResult extends HTMLComponent {
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

        const lootContainer = this.getElement("#loot")

        for (const loot of battleResult.loot) {
            const itemSlot = document.createElement("item-slot")
            itemSlot.setAttribute("item-id", loot.id)
            // itemSlot.setAttribute("amount", String(loot.amount))
            itemSlot.setAttribute("power", String(loot.power))
            itemSlot.setAttribute("rarity", String(loot.rarity))
            lootContainer.appendChild(itemSlot)
        }
    }
}

customElements.define("battle-result", BattleResult)
