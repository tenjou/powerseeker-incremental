import { HTMLComponent } from "../dom"

const template = document.createElement("template")
template.innerHTML = html`
    <div class="flex flex-1 justify-center">
        <span class="font-10 cursor-pointer">
            <i></i>
        </span>
    </div>
`

class CloseButtonElement extends HTMLComponent {
    constructor() {
        super(template)
    }

    connectedCallback(): void {
        super.connectedCallback()

        const iconElement = this.getElement("i")

        iconElement.onmouseenter = () => {
            iconElement.setAttribute("class", "fa-solid fa-circle-xmark")
        }
        iconElement.onmouseleave = () => {
            iconElement.setAttribute("class", "fa-regular fa-circle-xmark")
        }

        iconElement.setAttribute("class", "fa-regular fa-circle-xmark")
    }
}

customElements.define("close-button", CloseButtonElement)
