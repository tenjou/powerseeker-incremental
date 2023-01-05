import { ItemConfigs } from "../../config/item-configs"
import { HTMLComponent } from "../../dom"
import { Item } from "../item-types"

const template = document.createElement("template")
template.setAttribute("class", "icon-slot hover-outline inactive-children")
template.innerHTML = html`
    <img />
    <div id="value"></div>
`

export class ItemIconSlot extends HTMLComponent {
    constructor(srcTemplate?: HTMLTemplateElement) {
        super(srcTemplate || template)
    }

    connectedCallback(): void {
        super.connectedCallback()
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
        // this.toggleClassName("hide", item.power <= 1, "#amount")
        this.toggleClassName("color-gold", true, "#value")

        // const hidePower = this.haveAttribute("hide-power")
        // this.setText("#power", power)
        // this.toggleClassName("hide", hidePower || power <= 0, "#power")
    }
}

customElements.define("item-icon-slot", ItemIconSlot)
