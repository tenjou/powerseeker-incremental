import { ItemConfigs } from "../config/ItemConfigs"
import { HTMLComponent } from "../dom"
import { SlotType } from "../types"
import { getState } from "./../state"
import { unequipItem } from "./equipment"
import { i18n } from "./../local"

const template = document.createElement("template")
template.innerHTML = html`<style>
        :host {
            flex: 1;
            background: #ccc;
            border-radius: 3px;
            cursor: pointer;
        }
        :host(:hover) {
            background: #f5f5f5;
        }
    </style>

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
        const item = equipment[slotType]
        const itemConfig = item ? ItemConfigs[item.id] : null

        this.setText("x-text", i18n(itemConfig ? itemConfig.id : slotType))

        const itemSlot = this.getElement("item-slot")
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
