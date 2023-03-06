import { HTMLComponent } from "../../dom"
import { i18n } from "../../i18n"
import { getState } from "../../state"
import { EquipmentSlotElement } from "../../inventory/ui/equipment-slot"
import { subscribe } from "../../events"

const template = document.createElement("template")
template.className = "mb-3"
template.innerHTML = html`
    <div class="mb-2 px-2 bold font-2">${i18n("equipment")}</div>
    <div class="flex flex-row flex-1 ml-2">
        <div class="flex flex-column flex-1 sb-1 mr-1">
            <equipment-slot id="main-hand"></equipment-slot>
            <equipment-slot id="body"></equipment-slot>
        </div>
        <div class="flex flex-column flex-1 sb-1">
            <equipment-slot id="off-hand"></equipment-slot>
            <equipment-slot id="accessory"></equipment-slot>
        </div>
    </div>
`

export class CharacterEquipment extends HTMLComponent {
    constructor() {
        super(template)
    }

    connectedCallback(): void {
        super.connectedCallback()

        subscribe("equip", () => this.update())
    }

    update() {
        const { battler } = getState()

        this.getElement<EquipmentSlotElement>("#main-hand").update("main_hand")
        this.getElement<EquipmentSlotElement>("#off-hand").update("off_hand")
        this.getElement<EquipmentSlotElement>("#body").update("body")
        this.getElement<EquipmentSlotElement>("#accessory").update("accessory")
    }
}

customElements.define("character-equipment", CharacterEquipment)
