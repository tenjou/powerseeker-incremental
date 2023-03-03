import { EquipmentSlotType } from "../../config/item-configs"
import { i18n } from "../../i18n"
import { ItemIconSlot } from "./item-icon-slot"
import { LootService } from "./../loot-service"
import { EquipmentService } from "./../../equipment/equipment"
import { InventoryService } from "./../inventory"
import { getState } from "../../state"

const template = document.createElement("template")
template.className = "flex flex-row flex-1 bg-semi-white hover:bg-white border-radius-3 cursor-pointer inactive-children"
template.innerHTML = html`
    <div id="icon" class="icon-slot">
        <img class="hide" />
        <div id="value" class="color-white"></div>
    </div>
    <div class="flex flex-column px-1 justify-center"><div id="name"></div></div>
`

export class EquipmentSlot extends ItemIconSlot {
    constructor() {
        super(template)
    }

    update(EquipmentSlot: EquipmentSlotType) {
        const { equipment } = getState()

        const nameElement = this.getElement("#name")

        const item = equipment[EquipmentSlot]
        this.updateByItem(item)

        if (item) {
            nameElement.className = "color-black bold"
            nameElement.innerText = i18n(item.id)

            this.setAttrib("tooltip", item.id)
        } else {
            nameElement.className = "color-gray"
            nameElement.innerText = i18n(EquipmentSlot)

            this.setAttrib("tooltip", EquipmentSlot)
        }

        this.onclick = () => {
            const item = LootService.generateItem("leather_clothing", 1, 0)
            InventoryService.add(item)
            EquipmentService.equip(item)
            // EquipmentService.unequip("body")
        }
    }
}

customElements.define("equipment-slot", EquipmentSlot)
