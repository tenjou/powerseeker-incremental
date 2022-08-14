import { AbilityConfigs } from "../config/ability-configs"
import { HTMLComponent } from "../dom"
import { AbilityId } from "../types"

const template = document.createElement("template")
template.innerHTML = html`<style>
        :host {
            position: relative;
            display: flex;
            flex-direction: column;
            border-radius: 3px;
            width: 40px;
            min-height: 40px;
            background: #b5b5b5;
            cursor: pointer;
        }
        :host(:hover) {
            outline: 2px solid white;
        }
        :host(.inactive) {
            pointer-events: none;
        }

        img {
            padding: 4px;
            width: 32px;
            height: 32px;
            image-rendering: pixelated;
        }

        power {
            width: 100%;
            flex: 1;
            padding: 0 4px;
            box-sizing: border-box;
            font-size: 9px;
            text-align: center;
            text-shadow: 0 0 2px black;
            color: #fff;
            border-bottom-left-radius: 3px;
            border-bottom-right-radius: 3px;
            background: #000;
        }

        amount {
            position: absolute;
            right: 0;
            top: 29px;
            color: #fff;
            background: #000000ad;
            padding: 0 3px;
            font-size: 10px;
            border-radius: 2px;
            text-shadow: 0 0 2px black;
        }

        .hide {
            display: none;
        }
    </style>

    <img />
    <power></power>
    <amount></amount>`

export class AbilitySlotElement extends HTMLComponent {
    constructor() {
        super(template)
    }

    update() {
        const abilityId = this.getAttribute("ability-id") as AbilityId
        const abilityConfig = AbilityConfigs[abilityId]

        const imgElement = this.getElement("img")
        imgElement.setAttribute("src", `/assets/icon/skill/${abilityConfig.id}.png`)

        // this.setText("amount", `1/10`)
        this.setText("power", `1 / 10`)

        if (this.getAttribute("inactive") !== null) {
            this.classList.add("inactive")
        }

        // let power = 0
        // let rarity = 0
        // let amount = 0
        // let itemId
        // this.className = ""
        // const uid = Number(this.getAttribute("uid"))
        // if (uid) {
        //     const { inventory, equipment } = getState()
        //     let item: Item | undefined | null
        //     const equipmentSlot = this.getAttribute("equipment-slot")
        //     if (equipmentSlot) {
        //         item = equipment[equipmentSlot as SlotType]
        //     } else {
        //         item = inventory.find((entry) => entry.uid === uid)
        //     }
        //     if (item) {
        //         itemId = item.id
        //         power = item.power
        //         rarity = item.rarity
        //         amount = item.amount
        //     }
        // } else {
        //     itemId = this.getAttribute("item-id")
        // }
        // if (itemId) {
        //     const itemConfig = ItemConfigs[itemId as ItemId]
        //     const imgElement = this.getElement("img")
        //     imgElement.setAttribute("src", `/assets/icon/${itemConfig.type}/${itemId}.png`)
        //     imgElement.classList.remove("hide")
        // } else {
        //     this.getElement("img").classList.add("hide")
        // }
        // if (this.getAttribute("inactive") !== null) {
        //     this.classList.add("inactive")
        // }
        // this.classList.add(`rarity-${rarity}`)
        // this.setText("amount", amount)
        // this.toggleClassName("hide", amount <= 1, "amount")
        // const hidePower = this.haveAttribute("hide-power")
        // this.setText("power", power)
        // this.toggleClassName("hide", hidePower || power <= 0, "power")
    }

    attributeChangedCallback() {
        this.update()
    }

    static get observedAttributes() {
        return ["ability-id"]
    }
}

customElements.define("ability-slot", AbilitySlotElement)
