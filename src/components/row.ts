import { HTMLComponent } from "../dom"

const template = document.createElement("template")
template.innerHTML = html`<style>
        :host {
            display: flex;
            flex-direction: row;
        }
        :host(.flex) {
            flex: 1;
        }
        :host(.center-h) {
            justify-content: center;
        }
        :host(.center-v) {
            align-items: center;
        }
        :host(.padding10) {
            padding: 10px;
        }
    </style>

    <slot></slot>`

class Row extends HTMLComponent {
    constructor() {
        super(template)
    }
}

customElements.define("x-row", Row)
