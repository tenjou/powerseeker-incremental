import { HTMLComponent } from "../dom"

const template = document.createElement("template")
template.innerHTML = html`<link rel="stylesheet" href="./ext/font-awesome/all.min.css" />
    <style>
        :host {
            cursor: pointer;
            font-size: 40px;
        }
        :host(:active) {
            transform: translateY(1px);
        }
    </style>

    <i class="fa-regular fa-circle-xmark"></i>`

customElements.define(
    "close-button",
    class extends HTMLComponent {
        constructor() {
            super(template)

            this.onmouseenter = () => {
                this.getElement("i").setAttribute("class", "fa-solid fa-circle-xmark")
            }
            this.onmouseleave = () => {
                this.getElement("i").setAttribute("class", "fa-regular fa-circle-xmark")
            }

            this.getElement("i").setAttribute("class", "fa-regular fa-circle-xmark")
        }
    }
)
