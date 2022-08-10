import { ItemConfigs } from "../config/item-configs"
import { HTMLComponent } from "../dom"
import { SlotType } from "../types"
import { getState } from "../state"
import { unequipItem } from "./equipment"
import { i18n } from "../local"
import { goTo } from "../view"

const template = document.createElement("template")
template.innerHTML = html`<style>
        :host {
            display: flex;
            flex: 1;
            margin-bottom: 2px;
            background: #ccc;
            border-radius: 3px;
            cursor: pointer;
        }
        :host(:hover) {
            background: #f5f5f5;
        }

        x-column {
            width: 200px;
        }

        #name {
            padding: 0 4px;
            font-size: 11px;
            color: #222222;
        }
        :host(.empty) #name {
            color: #908f8f;
        }

        #power {
            padding: 0 4px;
            font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif;
            font-size: 10px;
            color: #646262;
        }
    </style>

    <item-slot inactive hide-power></item-slot>
    <x-column class="center-v space2"><x-text id="name" class="bold"></x-text><x-text id="power"></x-text></x-column>`

export class EquipmentSlot extends HTMLComponent {
    constructor() {
        super(template)

        this.onclick = () => {
            // unequipItem(this.slotType())
            goTo(`/equipment/${this.slotType()}`)
        }

        this.update()
    }

    update() {
        const { equipment } = getState()

        const slotType = this.slotType()
        const item = equipment[slotType]
        const itemConfig = item ? ItemConfigs[item.id] : null

        this.toggleClassName("empty", !itemConfig)

        this.setText("#name", i18n(itemConfig ? itemConfig.id : slotType))
        this.setText("#power", item ? item.power : "")

        const itemSlot = this.getElement("item-slot")
        itemSlot.setAttribute("uid", item ? String(item.uid) : "")
        itemSlot.setAttribute("equipment-slot", slotType)
    }

    slotType(): SlotType {
        const slotType = this.getAttribute("slot-type")
        if (!slotType) {
            return "none" as SlotType
        }

        return slotType as SlotType
    }
}

customElements.define("equipment-slot", EquipmentSlot)
