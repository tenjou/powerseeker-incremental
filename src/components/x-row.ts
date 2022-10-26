import { HTMLComponent } from "../dom"

const template = document.createElement("template")
template.innerHTML = html`<style>
        :host {
            display: flex;
            flex-direction: row;
        }
        :host(.colored) {
            margin: 3px 0;
            padding: 6px;
            background: #e9e7e7;
            border-radius: 3px;
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
