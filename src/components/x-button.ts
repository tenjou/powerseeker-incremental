import { HTMLComponent } from "../dom"

const template = document.createElement("template")
template.innerHTML = html`<style>
        :host {
            width: 100px;
            padding: 6px;
            font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif;
            font-weight: 600;
            font-size: 11px;
            text-align: center;
            color: #222;
            text-transform: uppercase;
            cursor: pointer;
        }
        :host(:active) {
            transform: translateY(1px);
        }
        :host(.disabled) {
            opacity: 0.5;
            pointer-events: none;
        }

        :host(.black) {
            border: 1px solid #666;
            border-radius: 3px;
        }
        :host(.black:hover) {
            padding: 7px;
            margin: -1px;
            border: 1px solid #000;
            background: #f1f1f1;
            color: #000;
        }

        :host(.size50) {
            width: 50px;
        }
    </style>

    <slot></slot>`

customElements.define(
    "x-button",
    class extends HTMLComponent {
        constructor() {
            super(template)
        }
    }
)
