import { HTMLComponent } from "../dom"
import { i18n } from "../i18n"

const template = document.createElement("template")
template.className = "block pb-1 mb-3 border-bottom font-3 color-dark bold"
template.innerHTML = html`
    <span id="category"></span>
`

export class ViewHeader extends HTMLComponent {
    constructor() {
        super(template)
    }

    connectedCallback() {
        super.connectedCallback()

        const category = this.getAttribute("category")
        if (category) {
            this.setText("#category", i18n(category))
        }
    }
}

customElements.define("view-header", ViewHeader)
