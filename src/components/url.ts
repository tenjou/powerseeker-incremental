import { HTMLComponent } from "../dom"
import { goTo } from "../view"

const template = document.createElement("template")
template.innerHTML = html`
    <style>
        :host {
            padding: 4px 8px;
            margin: 1px 5px;
            border-radius: 4px;
            font-weight: 600;
            cursor: pointer;
        }
        :host(:hover) {
            background: #ccc;
        }
        :host(.active) {
            background: #000;
            color: #fff;
        }
    </style>

    <slot></slot>
`

class Url extends HTMLComponent {
    constructor() {
        super(template)

        this.onclick = () => {
            goTo(this.getAttribute("href"))
        }
    }
}

customElements.define("x-url", Url)
