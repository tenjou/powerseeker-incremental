import { HTMLComponent } from "../dom"

const template = document.createElement("template")
template.className = "element-icon"

class ElementIcon extends HTMLComponent {
    constructor() {
        super(template)
    }

    connectedCallback(): void {
        super.connectedCallback()

        this.toggleClassName(this.getAttrib("type"), true)
    }
}

customElements.define("element-icon", ElementIcon)
