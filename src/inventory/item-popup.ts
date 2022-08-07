import { ItemConfig, ItemConfigs, ItemId, ItemEffect } from "../config/ItemConfigs"
import { HTMLComponent } from "../dom"
import { equipItem } from "../equipment/equipment"
import { getState } from "../state"
import { i18n } from "./../local"
import { handleItemUse } from "./inventory"
import { closePopup } from "./../popup"

const template = document.createElement("template")
template.innerHTML = html`<style>
        power {
            margin-left: 3px;
            margin-right: 4px;
            text-transform: uppercase;
            font-weight: 600;
            font-size: 9px;
            color: #8f8f8f;
        }

        #description {
            margin: 4px 0;
        }

        blue {
            color: #2196f3;
            font-weight: 700;
        }

        semibold {
            font-weight: 600;
        }
    </style>

    <popup-container>
        <x-row>
            <item-slot class="inactive"></item-slot>
            <x-column class="center-v flex">
                <x-text id="name" class="semibold"></x-text>
                <x-text id="type" class="tertiary"></x-text>
            </x-column>

            <x-column class="center-v">
                <x-row class="center-v">
                    <x-text class="bold size22" id="power"></x-text>
                    <power>Power</power>
                </x-row>
            </x-column>
        </x-row>

        <div id="description"></div>

        <x-row class="center-h" id="actions"> </x-row>
    </popup-container>`

export class ItemPopup extends HTMLComponent {
    constructor() {
        super(template)
    }

    connectedCallback() {
        const uid = Number(this.getAttribute("uid"))
        if (uid) {
            const { inventory } = getState()

            const item = inventory.find((entry) => entry.uid === uid)
            if (!item) {
                console.error("Could not find the item: ${uid}")
                return
            }

            const callback = () => {
                handleItemUse(item)
                closePopup()
            }

            const itemConfig = ItemConfigs[item.id]
            switch (itemConfig.type) {
                case "armor":
                    this.addAction("Equip", callback)
                    break
                case "consumable":
                    this.addAction("Consume", callback)
                    break
            }
        }

        this.update()
    }

    update() {
        const { inventory } = getState()

        const itemSlot = this.getElement("item-slot")
        itemSlot.setAttribute("hide-power", "true")

        const uid = Number(this.getAttribute("uid"))
        let itemId = this.getAttribute("item-id")
        let itemPower = 0

        if (uid) {
            const item = inventory.find((entry) => entry.uid === uid)
            if (!item) {
                console.error("Could not find the item with UID: ${uid}")
                return
            }

            itemId = item.id
            itemPower = item.power
            itemSlot.setAttribute("uid", String(uid))
        } else if (!itemId) {
            console.error(`ItemPopup should have either one of attributes: "uid" or "itemId"`)
            return
        }

        itemSlot.setAttribute("item-id", itemId)

        const itemConfig = ItemConfigs[itemId as ItemId]
        this.setText("#name", i18n(itemId))
        this.setText("#type", i18n(itemConfig.type))
        this.setText("#power", itemPower)
        this.setHTML("#description", getDescription(itemConfig, itemPower))
    }

    addAction(name: string, func: () => void) {
        const button = document.createElement("x-button")
        button.className = "black"
        button.innerText = name
        button.onclick = func
        this.getElement("#actions").appendChild(button)
    }
}

customElements.define("item-popup", ItemPopup)

function getDescription(itemConfig: ItemConfig, itemPower: number) {
    if (itemConfig.type !== "consumable") {
        return itemConfig.description
    }

    const regex = /%[0-9]/gm
    const regexDescription = regex.exec(itemConfig.description)
    if (!regexDescription) {
        return itemConfig.description
    }

    let description = itemConfig.description

    const effects = itemConfig.effects
    for (const entry of regexDescription) {
        const effectId = Number(entry.slice(1))
        const effect = effects[effectId]
        const color = getEffectColor(effect)
        const power = getMaxPower(effect, itemPower)

        description = description.replace(entry, `<${color}>${power}</${color}>`)
    }

    return description
}

function getEffectColor(effect: ItemEffect) {
    return "blue"
}

function getMaxPower(effect: ItemEffect, power: number) {
    return effect.value + power
}
