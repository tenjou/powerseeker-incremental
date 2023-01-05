import { ItemConfigEquipment, ItemConfigs } from "../../config/item-configs"
import { HTMLComponent } from "../../dom"
import { Item } from "../../inventory/item-types"
import { getRarityText } from "../../inventory/item-utils"
import { i18n } from "./../../i18n"

const template = document.createElement("template")
template.innerHTML = html`
    <div class="flex bold">
        <span id="name"></span>
        <span class="flex-1"></span>
        <span id="rarity"></span>
    </div>

    <div class="flex flex-row color-gray">
        <span id="equipment-slot"></span>
        <span class="flex-1"></span>
        <span id="equipment-type"></span>
    </div>

    <div class="spacing-6"></div>

    <div class="flex flex-row ">
        <div id="power" class="color-gold"></div>
    </div>

    <div class="spacing-6"></div>

    <div id="stats"></div>

    <div class="flex flex-row ">
        <span class="flex-1"></span>
        <div id="level"></div>
    </div>

    <div class="spacing-6"></div>

    <div class="color-gray">An axe is a powerful weapon and tool that can be wielded one or two-handed.</div>
`

export class ItemTooltip extends HTMLComponent {
    constructor() {
        super(template)
    }

    updateItem(item: Item) {
        const itemConfig = ItemConfigs[item.id]

        switch (itemConfig.type) {
            case "equipment":
                this.updateEquipment(item, itemConfig)
                break
        }
    }

    updateEquipment(item: Item, itemConfig: ItemConfigEquipment) {
        this.setText("#name", i18n(itemConfig.id))
        this.setText("#rarity", getRarityText(item.rarity))
        this.setText("#equipment-slot", i18n(itemConfig.slot))
        this.setText("#equipment-type", i18n(itemConfig.equipmentType))
        this.setText("#power", `${i18n("power")} ${item.power}`)
        this.setText("#level", `${i18n("level")} ${item.level}`)

        this.getElement("#rarity").setAttribute("class", `color-${item.rarity}`)

        const stats = this.getElement("#stats")
        while (stats.firstChild) {
            stats.removeChild(stats.firstChild)
        }

        for (const stat of item.stats) {
            const div = document.createElement("div")
            const span1 = document.createElement("span")
            const span2 = document.createElement("span")
            span2.setAttribute("class", "color-gray")

            span1.innerText = `+${stat.value} `
            span2.innerText = i18n(stat.type)

            div.appendChild(span1)
            div.appendChild(span2)

            stats.appendChild(div)
        }
    }
}

customElements.define("item-tooltip", ItemTooltip)
