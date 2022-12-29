import { EquipmentSlot, ItemConfigs, ItemId } from "../../config/item-configs"
import { HTMLComponent } from "../../dom"
import { getState } from "../../state"
import { Item } from "../../types"

const template = document.createElement("template")
template.innerHTML = html`
    <img />
    <div id="power"></div>
    <div id="amount"></div>
`

export class ItemSlot extends HTMLComponent {
    constructor() {
        super(template)
    }

    update() {
        let power = 0
        let rarity = 0
        let amount = 0
        let itemId

        this.className = ""

        const uid = Number(this.getAttribute("uid"))
        if (uid) {
            const { inventory, equipment } = getState()

            let item: Item | undefined | null

            const equipmentSlot = this.getAttribute("equipment-slot")
            if (equipmentSlot) {
                item = equipment[equipmentSlot as EquipmentSlot]
            } else {
                item = inventory.find((entry) => entry.uid === uid)
            }

            if (item) {
                itemId = item.id
                power = item.power
                rarity = item.rarity
                amount = item.amount
            }
        } else {
            itemId = this.getAttribute("item-id")
            amount = Number(this.getAttribute("amount"))
            power = Number(this.getAttribute("power"))
            rarity = Number(this.getAttribute("rarity"))
        }

        if (itemId) {
            const itemConfig = ItemConfigs[itemId as ItemId]
            const imgElement = this.getElement("img")
            imgElement.setAttribute("src", `/assets/icon/${itemConfig.type}/${itemId}.png`)
            imgElement.classList.remove("hide")
        } else {
            this.getElement("img").classList.add("hide")
        }

        if (this.getAttribute("inactive") !== null) {
            this.classList.add("inactive")
        }
        this.classList.add(`rarity-${rarity}`)

        this.setText("#amount", amount)
        this.toggleClassName("hide", amount <= 1, "#amount")

        const hidePower = this.haveAttribute("hide-power")
        this.setText("#power", power)
        this.toggleClassName("hide", hidePower || power <= 0, "#power")
    }

    static get observedAttributes() {
        return ["uid", "item-id"]
    }
}

customElements.define("item-slot", ItemSlot)
