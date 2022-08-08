import { ItemConfigs, ItemId } from "../config/ItemConfigs"
import { HTMLComponent } from "../dom"
import { getState } from "../state"
import { emit } from "./../events"

const template = document.createElement("template")
template.innerHTML = html`<style>
        :host {
            position: relative;
            display: flex;
            flex-direction: column;
            border-radius: 3px;
            width: 40px;
            background: #b5b5b5;
            cursor: pointer;
        }
        :host(:hover) {
            outline: 2px solid white;
        }
        :host(.inactive) {
            cursor: initial;
        }
        :host(.inactive:hover) {
            outline: initial;
        }

        :host(.rarity-0) {
            background: linear-gradient(#bdbdbd, #a0a0a0);
        }
        :host(.rarity-1) {
            background: linear-gradient(#9bd459, #73a737);
        }
        :host(.rarity-2) {
            background: linear-gradient(#94acbf, #03a9f4);
        }
        :host(.rarity-3) {
            background: linear-gradient(#be8ec5, #b43fc7);
        }
        :host(.rarity-4) {
            background: linear-gradient(#d0c56a, #eca235);
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
            background: #727272;
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

export class ItemSlot extends HTMLComponent {
    constructor() {
        super(template)

        this.onmouseover = () => {
            const itemId = this.getAttribute("item-id")
            if (itemId) {
                const itemConfig = ItemConfigs[itemId as ItemId]
                emit("item-hover", itemConfig)
            }
        }
    }

    connectedCallback() {
        this.update()
    }

    update() {
        let power = 0
        let rarity = 0
        let amount = 0
        let itemId

        const uid = Number(this.getAttribute("uid"))
        if (uid) {
            const { inventory } = getState()

            const item = inventory.find((entry) => entry.uid === uid)
            if (item) {
                itemId = item.id
                power = item.power
                rarity = item.rarity
                amount = item.amount
            }
        } else {
            itemId = this.getAttribute("item-id")
        }

        if (itemId) {
            const itemConfig = ItemConfigs[itemId as ItemId]
            const imgElement = this.getElement("img")
            imgElement.setAttribute("src", `./assets/icon/${itemConfig.type}/${itemId}.png`)
            imgElement.classList.remove("hide")

            this.classList.add(`rarity-${rarity}`)
        } else {
            this.getElement("img").classList.add("hide")
        }

        this.setText("amount", amount)
        this.toggleClassName("hide", amount <= 1, "amount")

        const hidePower = !!this.getAttribute("hide-power")
        this.setText("power", power)
        this.toggleClassName("hide", hidePower || power <= 0, "power")
    }

    attributeChangedCallback() {
        this.update()
    }

    static get observedAttributes() {
        return ["uid", "item-id"]
    }
}

customElements.define("item-slot", ItemSlot)
