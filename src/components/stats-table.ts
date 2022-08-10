import { HTMLComponent } from "../dom"

export interface StatsTableEntry {
    key: string
    value: number | string
}

const template = document.createElement("template")
template.innerHTML = html`<style>
        :host {
            margin: 10px 0;
        }

        #content {
            display: flex;
            flex-direction: column;
        }
        #content > * {
            padding: 2px 5px;
            font-family: Calibri;
            font-size: 13px;
            color: #2e2e2e;
        }
        #content > *:nth-child(odd) {
            background: #ffffff61;
            border-radius: 3px;
        }

        key {
            width: 120px;
            font-weight: bold;
        }
        value {
            width: 100%;
            font-weight: 400;
        }
    </style>

    <div id="content"></div>`

export class StatsTable extends HTMLComponent {
    constructor() {
        super(template)
    }

    connectedCallback() {
        this.update()
    }

    attributeChangedCallback() {
        this.update()
    }

    update() {
        const data = this.getAttribute("data") || "[]"
        const buffer = JSON.parse(data) as StatsTableEntry[]
        this.removeAttribute("data")

        const content = this.getElement("#content")

        while (content.firstChild) {
            content.removeChild(content.firstChild)
        }

        for (const item of buffer) {
            const row = document.createElement("x-row")

            const keyText = document.createElement("key")
            keyText.innerHTML = item.key
            row.appendChild(keyText)

            const valueText = document.createElement("value")
            valueText.innerHTML = String(item.value)
            row.appendChild(valueText)

            content.appendChild(row)
        }
    }

    static get observedAttributes() {
        return ["data"]
    }
}

customElements.define("stats-table", StatsTable)
