import { ItemConfig, ItemConfigs, ItemEffect, ItemId } from "../../config/item-configs"
import { HTMLComponent } from "../../dom"
import { getState } from "../../state"
import { StatsTableEntry } from "../../components/stats-table"
import { i18n } from "../../i18n"
import { closePopup } from "../../popup"
import { handleItemUse } from "../inventory"

const template = document.createElement("template")
template.innerHTML = html`
    <style>
        power {
            margin-left: 3px;
            margin-right: 4px;
            text-transform: uppercase;
            font-weight: 600;
            font-size: 9px;
            color: #8f8f8f;
        }

        #description {
            margin: 8px 0 12px 0;
            border-top: 1px solid #d5d5d5;
            padding-top: 6px;
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
            <item-slot inactive hide-power></item-slot>
            <x-column class="center-v flex margin5">
                <x-text id="name" class="semibold line16"></x-text>
                <x-text id="type" class="tertiary"></x-text>
            </x-column>

            <x-column class="center-v">
                <x-row class="center-v">
                    <x-text class="bold size22" id="power"></x-text>
                    <power>Power</power>
                </x-row>
            </x-column>
        </x-row>

        <!-- <div id="description"></div> -->
        <stats-table></stats-table>

        <x-row class="center-h" id="actions"></x-row>
    </popup-container>
`

export class ItemPopup extends HTMLComponent {
    constructor() {
        super(template)
    }

    connectedCallback() {
        const uid = this.getAttribute("uid")
        if (uid) {
            const { inventory } = getState()

            const item = inventory.find((entry) => entry.uid === uid)
            if (!item) {
                console.error(`Could not find the item: ${uid}`)
                return
            }

            const callback = () => {
                handleItemUse(item)
                closePopup()
            }

            const itemConfig = ItemConfigs[item.id]
            switch (itemConfig.type) {
                case "equipment":
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

        const uid = this.getAttribute("uid")
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
        } else {
            if (!itemId) {
                console.error(`ItemPopup should have either one of attributes: "uid" or "itemId"`)
                return
            }

            itemPower = Number(this.getAttribute("power"))
            const itemRarity = Number(this.getAttribute("rarity"))

            itemSlot.setAttribute("item-id", itemId)
            itemSlot.setAttribute("power", String(itemPower))
            itemSlot.setAttribute("rarity", String(itemRarity))
        }

        const itemConfig = ItemConfigs[itemId as ItemId]

        this.setText("#name", i18n(itemId))
        this.setText("#type", listItemTypes(itemConfig))
        this.setText("#power", itemPower)

        const description = getDescription(itemConfig, itemPower)
        this.setHTML("#description", description)

        if (itemConfig.type === "equipment") {
            const xAttribute = this.getElement("stats-table")
            const data = itemConfig.stats.map<StatsTableEntry>((entry) => {
                return {
                    key: i18n(entry.type),
                    value: entry.value,
                }
            })
            xAttribute.setAttribute("data", JSON.stringify(data))
        }
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
    let description = i18n(`${itemConfig.id}_description`) || ""

    if (itemConfig.type !== "consumable") {
        return description
    }

    const regex = /%[0-9]/gm
    const regexDescription = regex.exec(description)
    if (!regexDescription) {
        return description
    }

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

function listItemTypes(itemConfig: ItemConfig) {
    if (itemConfig.type === "equipment") {
        return `${i18n(itemConfig.type)}, ${i18n(itemConfig.equipmentType)}`
    }

    return i18n(itemConfig.type)
}
