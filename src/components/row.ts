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
    </style>

    <slot></slot>`

customElements.define(
    "x-row",
    class extends HTMLComponent {
        constructor() {
            super(template)
        }
    }
)
