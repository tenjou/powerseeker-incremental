import { i18n } from "../../i18n"
import { Item } from "../item-types"
import { ItemIconSlot } from "./item-icon-slot"

const template = document.createElement("template")
template.setAttribute("class", "flex flex-row hover-outline inactive-children")
template.innerHTML = html`
    <div class="icon-slot">
        <img />
        <div id="amount"></div>
    </div>
    <div class="flex-100px rounded-r bg-white">
        <div id="name"></div>
    </div>
`

export class ItemSlot extends ItemIconSlot {
    constructor() {
        super(template)
    }

    updateByItem(item: Item) {
        super.updateByItem(item)

        this.setText("#name", i18n(item.id))
    }
}

customElements.define("item-slot", ItemSlot)
