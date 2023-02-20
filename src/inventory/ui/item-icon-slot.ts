import { ItemConfigs, ItemId } from "../../config/item-configs"
import { HTMLComponent } from "../../dom"
import { Item } from "../item-types"

const template = document.createElement("template")
template.setAttribute("class", "icon-slot hover-outline inactive-children")
template.innerHTML = html`
    <img />
    <div id="xp" class="flex flex-1 align-center justify-center height-100 font-8 bold text-shadow-5 color-white hidden">XP</div>
    <div id="value"></div>
`

export class ItemIconSlot extends HTMLComponent {
    item: Item | null = null

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
        this.setAttrib("item-id", item.id)
        this.item = item

        if (itemConfig.type === "equipment") {
            this.setText("#value", item.power)
            this.getElement("#value").setAttribute("class", "color-gold")
        } else {
            this.setText("#value", item.amount)
            this.getElement("#value").setAttribute("class", "color-white")
        }
    }

    updateByItemId(itemId: ItemId, min: number, max: number = min) {
        const itemConfig = ItemConfigs[itemId]

        this.setAttrib("item-id", itemId)
        this.item = null

        const imgElement = this.getElement("img")
        imgElement.setAttribute("src", `/assets/icon/${itemConfig.type}/${itemId}.png`)
        this.toggleClass("img", "hidden", itemId === "xp")
        this.toggleClass("#xp", "hidden", itemId !== "xp")

        if (itemId === "xp") {
            this.classList.add(`rarity-xp`)
        }

        if (min === max) {
            this.setText("#value", min)
        } else {
            this.setText("#value", `${min} - ${max}`)
        }

        this.getElement("#value").setAttribute("class", itemConfig.type === "equipment" ? "color-gold" : "color-white")
    }
}

customElements.define("item-icon-slot", ItemIconSlot)
