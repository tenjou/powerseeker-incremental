import { HTMLComponent } from "../dom"
import { SlotType } from "../types"
import { getState } from "./../state"
import { unequipItem } from "./equipment"

const template = document.createElement("template")
template.innerHTML = html`<style></style>

    <item-slot></item-slot>
    <x-column class="center-v"><x-text></x-text></x-column>`

export class EquipmentSlot extends HTMLComponent {
    constructor() {
        super(template)

        this.onclick = () => {
            unequipItem(this.slotType())
        }
    }

    update() {
        const { equipment } = getState()

        const slotType = this.slotType()
        this.setText("x-text", slotType)

        const itemSlot = this.getElement("item-slot")
        const item = equipment[slotType]
        itemSlot.setAttribute("item-id", item ? item.id : "")
    }

    slotType(): SlotType {
        const slotType = this.getAttribute("slot-type")
        if (!slotType) {
            console.error(`EquipmentSlot is missing a slot type attribute`)
        }

        return slotType as SlotType
    }
}

customElements.define("equipment-slot", EquipmentSlot)
