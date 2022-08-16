import { HTMLComponent } from "../dom"
import { subscribe, unsubscribe } from "./../events"
import { CurrencyType } from "./currency-types"
import { getState } from "./../state"

const template = document.createElement("template")
template.innerHTML = html`<style>
        :host {
            display: flex;
            align-items: center;
            font-weight: bold;
            text-transform: uppercase;

            min-width: 60px;
            padding: 4px 5px;
            background: #efefef;
            border-radius: 3px;
            font-size: 11px;
            margin-left: 10px;
        }

        span {
            width: 100%;
            text-align: right;
        }

        ap {
            display: block;
            font-weight: bold;
            background: #00bcd4;
            color: #fff;
            padding: 4px;
            border-radius: 3px;
            font-size: 10px;
            text-shadow: 1px 1px 0px black;
            border: 1px solid #030f1424;
            background: linear-gradient(#00bcd4, #03a9f4);
            <!-- background: linear-gradient(#e91e63, #e91e63); -->
        }
    </style>

    <icon></icon>
    <span>0</span>`

export class CurrencyItem extends HTMLComponent {
    updateCallback: () => void

    constructor() {
        super(template)

        this.updateCallback = () => this.update()

        const currencyType = this.getAttribute("currency")
        if (!currencyType) {
            console.error(`Missing "currency" attribute for CurrencyItem element`)
            return
        }

        if (currencyType === "ap") {
            const apElement = document.createElement("ap")
            apElement.innerText = "AP"
            this.getElement("icon").appendChild(apElement)
        } else {
            const imgElement = document.createElement("img")
            imgElement.setAttribute("src", `/assets/icon/currency/${currencyType}.png`)
            this.getElement("icon").appendChild(imgElement)
        }

        this.update()

        subscribe("currency-updated", this.updateCallback)
    }

    disconnectedCallback() {
        unsubscribe("currency-updated", this.updateCallback)
    }

    attributeChangedCallback() {
        this.update()
    }

    update() {
        const currencyType = this.getAttribute("currency")
        if (!currencyType) {
            return
        }

        const { currencies } = getState()
        const currency = currencies[currencyType as CurrencyType]

        const needValue = Number(this.getAttribute("need"))
        if (needValue) {
            this.getElement("span").innerText = `${needValue} / ${currency}`
        } else {
            this.getElement("span").innerText = `${currency}`
        }
    }

    static get observedAttributes() {
        return ["need"]
    }
}

customElements.define("currency-item", CurrencyItem)
