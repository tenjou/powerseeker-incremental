import { HTMLComponent } from "../dom"

export class ScrollingText extends HTMLComponent {
    constructor() {
        super(template)
    }

    setup(text: string, color: string, icon: string | null) {
        if (icon) {
            this.getElement("img").setAttribute("src", icon)
        } else {
            this.getElement("img").style.display = "none"
        }

        if (text) {
            this.style.color = color || "#f44336"
            this.innerText = text
        }

        setTimeout(() => {
            this.remove()
        }, 1100)
    }
}

customElements.define("scrolling-text", ScrollingText)

const template = document.createElement("template")
template.innerHTML = html`
    <img />
    <slot></slot>
`
