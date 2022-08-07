import { HTMLComponent } from "../dom"

const template = document.createElement("template")
template.innerHTML = html`<style>
        :host(.header) {
            font-weight: bold;
            text-transform: uppercase;
        }
        :host(.tertiary) {
            color: #787878;
        }
        :host(.semibold) {
            font-weight: 600;
        }
        :host(.bold) {
            font-weight: 700;
        }
        :host(.size10) {
            font-size: 10px;
        }
        :host(.size13) {
            font-size: 13px;
        }
        :host(.size22) {
            font-size: 22px;
        }
        :host(.size30) {
            font-size: 30px;
        }
        :host(.uppercase) {
            text-transform: uppercase;
        }
        :host(.space-2) {
            margin-bottom: 2px;
        }
    </style>

    <slot></slot>`

export class Text extends HTMLComponent {
    constructor() {
        super(template)
    }
}

customElements.define("x-text", Text)
