import { EquipmentSlotType } from "../../config/item-configs"
import { i18n } from "../../i18n"
import { ItemIconSlot } from "./item-icon-slot"
import { LootService } from "./../loot-service"
import { EquipmentService } from "../../equipment/equipment-service"
import { InventoryService } from "../inventory-service"
import { getState } from "../../state"
import { goTo } from "../../view"
import { setTooltip } from "./../../tooltip"

const template = document.createElement("template")
template.className = "flex flex-row flex-1 bg-semi-white hover:bg-white border-radius-3 cursor-pointer inactive-children"
template.innerHTML = html`
    <div id="icon" class="icon-slot">
        <img class="hide" />
        <div id="value" class="color-white"></div>
    </div>
    <div class="flex flex-column px-1 justify-center"><div id="name"></div></div>
`

export class EquipmentSlotElement extends ItemIconSlot {
    constructor() {
        super(template)
    }

    update(equipmentSlot: EquipmentSlotType) {
        const { equipment } = getState()

        const nameElement = this.getElement("#name")

        const item = equipment[equipmentSlot]

        this.updateByItem(item)

        if (item) {
            nameElement.className = "color-black bold"
            nameElement.innerText = i18n(item.id)
            setTooltip(this, ":item")
        } else {
            nameElement.className = "color-gray"
            nameElement.innerText = i18n(equipmentSlot)
            setTooltip(this, equipmentSlot)
        }

        this.onclick = () => {
            goTo(`equipment/${equipmentSlot}`)
        }
    }

    updateAsNone() {
        const nameElement = this.getElement("#name")
        nameElement.innerText = i18n("none")
    }
}

customElements.define("equipment-slot", EquipmentSlotElement)
