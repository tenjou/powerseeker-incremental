import { HTMLComponent } from "../dom"

const template = document.createElement("template")
template.className = "absolute px-1 py-1 bg-black-trans border-radius-3 font-1 font-gill color-semi-white uppercase bold "

export class ScrollingStatusText extends HTMLComponent {
    constructor() {
        super(template)
    }

    setup(text: string) {
        this.innerText = text

        setTimeout(() => {
            this.remove()
        }, 1100)
    }
}

customElements.define("scrolling-status-text", ScrollingStatusText)
