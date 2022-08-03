import { ItemConfigs, ItemId } from "../config/ItemConfigs"
import { HTMLComponent } from "../dom"
import { emit } from "./../events"

const template = document.createElement("template")
template.innerHTML = html`<style>
        :host {
            position: relative;
            border-radius: 3px;
            width: 32px;
            height: 32px;
            padding: 4px;
            background: #b5b5b5;
            cursor: pointer;
        }
        :host(:hover) {
            outline: 2px solid white;
        }

        img {
            width: 32px;
            height: 32px;
            image-rendering: pixelated;
        }

        amount {
            position: absolute;
            right: 0;
            bottom: 0;
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

    <img src="" />
    <amount>4</amount>`

class ItemSlot extends HTMLComponent {
    constructor() {
        super(template)

        this.onclick = () => {
            history.pushState({}, "", this.innerText.toLocaleLowerCase())
            window.dispatchEvent(new Event("onpushstate"))
        }
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
        const itemId = this.getAttribute("item-id")
        const amount = Number(this.getAttribute("amount"))

        if (itemId) {
            const itemConfig = ItemConfigs[itemId as ItemId]
            const imgElement = this.getElement("img")
            imgElement.setAttribute("src", `./assets/icon/${itemConfig.type}/${itemId}.png`)
            imgElement.classList.remove("hide")
        } else {
            this.getElement("img").classList.add("hide")
        }

        this.setText("amount", amount)
        this.toggleClassName("hide", amount <= 1, "amount")
    }

    attributeChangedCallback() {
        this.update()
    }

    static get observedAttributes() {
        return ["item-id", "amount"]
    }
}

customElements.define("item-slot", ItemSlot)
