import { ItemConfigs, ItemId } from "../../config/item-configs"
import { HTMLComponent } from "../../dom"
import { Item } from "../item-types"

const template = document.createElement("template")
template.className = "hover-outline inactive-children"
template.innerHTML = html`
    <div id="icon" class="icon-slot">
        <img class="hide" />
        <div id="value"></div>
    </div>
`

export class ItemIconSlot extends HTMLComponent {
    item: Item | null = null

    constructor(srcTemplate?: HTMLTemplateElement) {
        super(srcTemplate || template)
    }

    updateByItem(item: Item | undefined) {
        const imgElement = this.getElement("img")
        const icon = this.getElement("#icon")

        if (!item) {
            imgElement.classList.add("hide")
            icon.className = `icon-slot`
            this.setText("#value", "")
            this.removeAttribute("item-id")
            this.item = null
            return
        }

        const itemConfig = ItemConfigs[item.id]

        imgElement.setAttribute("src", `/assets/icon/${itemConfig.type}/${item.id}.png`)
        imgElement.classList.remove("hide")

        if (this.getAttribute("inactive") !== null) {
            this.classList.add("inactive")
        }

        icon.className = `icon-slot rarity-${item.rarity}`
        this.item = item

        if (itemConfig.type === "equipment") {
            this.setText("#value", item.power)
            this.getElement("#value").setAttribute("class", "color-gold")
        } else {
            this.setText("#value", item.amount)
            this.getElement("#value").setAttribute("class", "color-white")
        }

        this.setAttribute("item-id", item.id)
    }

    updateByItemId(itemId: ItemId, min: number, max: number = min) {
        const itemConfig = ItemConfigs[itemId]

        this.item = null

        const imgElement = this.getElement("img")
        imgElement.setAttribute("src", `/assets/icon/${itemConfig.type}/${itemId}.png`)
        imgElement.classList.remove("hide")

        this.setAttribute("item-id", itemId)

        if (min === max) {
            this.setText("#value", min)
        } else {
            this.setText("#value", `${min} - ${max}`)
        }

        this.getElement("#value").setAttribute("class", itemConfig.type === "equipment" ? "color-gold" : "color-white")
    }
}

customElements.define("item-icon-slot", ItemIconSlot)
