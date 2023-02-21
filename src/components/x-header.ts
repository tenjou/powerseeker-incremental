import { HTMLComponent } from "../dom"
import { i18n } from "../i18n"

const template = document.createElement("template")
template.className = "block pb-1 mb-3 border-bottom font-3 color-dark bold"

class Header extends HTMLComponent {
    constructor() {
        super(template)
    }

    connectedCallback() {
        super.connectedCallback()

        const title = this.getAttribute("title")
        if (title) {
            this.innerText = i18n(title)
        }
    }
}

customElements.define("x-header", Header)
