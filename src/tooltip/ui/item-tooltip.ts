import { ItemConfigEquipment, ItemConfigResource, ItemConfigs, ItemId } from "../../config/item-configs"
import { HTMLComponent } from "../../dom"
import { EquipmentSlot } from "../../equipment/equipment-types"
import { Item } from "../../inventory/item-types"
import { getRarityText } from "../../inventory/item-utils"
import { getSkillEffectColor } from "../../skills/skills-utils"
import { i18n } from "./../../i18n"
import { EquipmentSlotElement } from "./../../inventory/ui/equipment-slot"

const template = document.createElement("template")
template.innerHTML = html`
    <div class="flex bold">
        <span id="name"></span>
        <span class="flex-1 mr-3"></span>
        <span id="rarity"></span>
    </div>

    <div id="details">
        <div class="flex flex-row color-gray">
            <span id="equipment-slot"></span>
            <span class="flex-1"></span>
            <span id="equipment-type"></span>
        </div>

        <div class="spacing-6"></div>

        <div class="flex flex-row ">
            <div id="power" class="color-gold"></div>
        </div>

        <div class="spacing-6"></div>

        <div id="stats"></div>

        <div class="flex flex-row ">
            <span class="flex-1"></span>
            <div id="level"></div>
        </div>
    </div>

    <div class="spacing-6"></div>

    <div id="description" class="color-gray"></div>
`

export class ItemTooltip extends HTMLComponent {
    constructor() {
        super(template)
    }

    updateByItem(item: Item) {
        const itemConfig = ItemConfigs[item.id]

        switch (itemConfig.type) {
            case "equipment":
                this.updateEquipment(item, itemConfig)
                break
            case "resource":
                this.updateResource(item, itemConfig)
                break
        }
    }

    updateByItemId(itemId: ItemId) {
        const itemConfig = ItemConfigs[itemId]

        let description = i18n(`${itemConfig.id}_description`)

        if (itemConfig.type === "consumable") {
            const effects = itemConfig.effects

            const regex = /%[0-9]/gm
            const regexDescription = regex.exec(description)
            for (let n = 0; n < regexDescription.length; n++) {
                const entry = regexDescription[n]
                const power = effects[n].value
                const color = getSkillEffectColor("health", power)

                description = description.replace(entry, `<span class="color-${color} bold">${power}</span>`)
            }
        }

        this.setText("#name", i18n(itemConfig.id))
        this.setText("#rarity", i18n(itemConfig.type))

        this.getElement("#rarity").setAttribute("class", `color-gray`)
        this.setHTML("#description", description)

        this.toggleClass("#details", "hide", true)
    }

    updateEquipment(item: Item, itemConfig: ItemConfigEquipment) {
        this.setText("#name", i18n(itemConfig.id))
        this.setText("#rarity", getRarityText(item.rarity))
        this.setText("#equipment-slot", i18n(EquipmentSlot[itemConfig.equipmentType]))
        this.setText("#equipment-type", i18n(itemConfig.equipmentType))
        this.setText("#power", `${i18n("power")} ${item.power}`)
        this.setText("#level", `${i18n("level")} ${item.level}`)
        this.setText("#description", i18n(`${itemConfig.id}_description`))

        this.getElement("#rarity").setAttribute("class", `color-${item.rarity}`)

        this.toggleClass("#details", "hide", false)

        const stats = this.getElement("#stats", true)
        for (const stat of item.stats) {
            const div = document.createElement("div")
            const span1 = document.createElement("span")
            const span2 = document.createElement("span")
            span2.setAttribute("class", "color-gray")

            span1.innerText = `+${stat.value} `
            span2.innerText = i18n(stat.type)

            div.appendChild(span1)
            div.appendChild(span2)

            stats.appendChild(div)
        }
    }

    updateResource(item: Item, itemConfig: ItemConfigResource) {
        this.setText("#name", i18n(itemConfig.id))
        this.setText("#rarity", getRarityText(item.rarity))
        this.setText("#description", i18n(`${itemConfig.id}_description`))

        this.getElement("#rarity").setAttribute("class", `color-${item.rarity}`)

        this.toggleClass("#details", "hide", true)
    }
}

customElements.define("item-tooltip", ItemTooltip)
