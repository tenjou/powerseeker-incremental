import { ItemConfigs, ItemId } from "../../config/item-configs"
import { HTMLComponent } from "../../dom"
import { Item } from "../item-types"

const template = document.createElement("template")
template.setAttribute("class", "icon-slot hover-outline inactive-children")
template.innerHTML = html`
    <img />
    <div id="xp" class="flex flex-1 align-center justify-center height-100 font-2 bold text-shadow-5 color-white hidden">XP</div>
    <div id="value"></div>
`

export class ItemIconSlot extends HTMLComponent {
    constructor(srcTemplate?: HTMLTemplateElement) {
        super(srcTemplate || template)
    }

    updateByItem(item: Item) {
        const itemConfig = ItemConfigs[item.id]

        const imgElement = this.getElement("img")
        imgElement.setAttribute("src", `/assets/icon/${itemConfig.type}/${item.id}.png`)
        imgElement.classList.remove("hide")

        if (this.getAttribute("inactive") !== null) {
            this.classList.add("inactive")
        }

        this.classList.add(`rarity-${item.rarity}`)
        this.setText("#value", item.power)
        this.getElement("#value").setAttribute("class", itemConfig.type === "equipment" ? "color-gold" : "color-white")
    }

    updateByItemId(itemId: ItemId, amount: number) {
        const itemConfig = ItemConfigs[itemId]

        const imgElement = this.getElement("img")

        imgElement.setAttribute("src", `/assets/icon/${itemConfig.type}/${itemId}.png`)
        this.toggleClass("img", "hidden", itemId === "xp")
        this.toggleClass("#xp", "hidden", itemId !== "xp")

        if (itemId === "xp") {
            this.classList.add(`rarity-xp`)
        }

        this.setText("#value", amount)
        this.getElement("#value").setAttribute("class", itemConfig.type === "equipment" ? "color-gold" : "color-white")
    }
}

customElements.define("item-icon-slot", ItemIconSlot)
