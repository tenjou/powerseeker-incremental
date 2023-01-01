import { EquipmentSlot, ItemConfigs, ItemId } from "../../config/item-configs"
import { HTMLComponent } from "../../dom"
import { getState } from "../../state"
import { getItemByUId } from "../inventory"
import { Item } from "../item-types"

const template = document.createElement("template")
template.innerHTML = html`
    <img />
    <!-- <div id="power"></div> -->
    <div id="amount"></div>
`

export class ItemSlot extends HTMLComponent {
    constructor() {
        super(template)
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

        this.setText("#amount", item.power)
        this.toggleClassName("hide", item.power <= 1, "#amount")

        // const hidePower = this.haveAttribute("hide-power")
        // this.setText("#power", power)
        // this.toggleClassName("hide", hidePower || power <= 0, "#power")
    }

    static get observedAttributes() {
        return ["uid", "item-id"]
    }
}

customElements.define("item-slot", ItemSlot)
