import { HTMLComponent } from "../dom"

const template = document.createElement("template")
template.innerHTML = html`<style>
        :host {
            display: flex;
            flex-direction: column;
        }
        :host(.center-h) {
            align-items: center;
        }
        :host(.center-v) {
            justify-content: center;
        }
        :host(.flex) {
            flex: 1;
        }
    </style>

    <slot></slot>`

customElements.define(
    "x-column",
    class extends HTMLComponent {
        constructor() {
            super(template)
        }
    }
)
