import { ItemConfigs, ItemId } from "../config/ItemConfigs"
import { HTMLComponent } from "../dom"
import { getState } from "../state"
import { i18n } from "./../local"

const template = document.createElement("template")
template.innerHTML = html`<popup-container>
    <x-row>
        <item-slot class="inactive"></item-slot>
        <x-column class="center-v">
            <x-text id="name" class="semibold"></x-text>
            <x-text id="type" class="tertiary"></x-text>
        </x-column>
    </x-row>

    <x-row>
        <x-text>23</x-text>
        <x-text class="">Power</x-text>
    </x-row>

    <x-row
        ><p>
            You regain <green>14</green> health when you drink this potion. Whatever its potency, the potion’s red liquid glimmers when
            agitated.
        </p>
    </x-row>

    <x-row class="center-h">
        <x-button class="black">Equip</x-button>
    </x-row>
</popup-container>`

export class ItemPopup extends HTMLComponent {
    constructor() {
        super(template)
    }

    connectedCallback() {
        this.update()
    }

    update() {
        const { inventory } = getState()

        const uid = Number(this.getAttribute("uid"))
        const itemId = this.getAttribute("item-id")
        if (itemId) {
            const itemConfig = ItemConfigs[itemId as ItemId]
            const item = inventory.find((entry) => entry.uid === uid)

            this.setText("#name", i18n(itemId))
            this.setText("#type", i18n(itemConfig.type))

            const itemSlot = this.getElement("item-slot")
            itemSlot.setAttribute("item-id", itemId)
            itemSlot.setAttribute("amount", item ? String(item.amount) : "0")
        }
    }
}

customElements.define("item-popup", ItemPopup)

function loadActions() {}
