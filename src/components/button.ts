import { HTMLComponent } from "../dom"

const template = document.createElement("template")
template.innerHTML = html`<style>
        :host {
            width: 100px;
            padding: 6px;
            font-family: "Roboto", sans-serif;
            font-weight: 600;
            font-size: 10px;
            text-align: center;
            color: #222;
            text-transform: uppercase;
            cursor: pointer;
        }
        :host(:active) {
            transform: translateY(1px);
        }

        :host(.black) {
            border: 2px solid #222;
            border-radius: 3px;
        }
        :host(.black:hover) {
            padding: 7px;
            margin: -1px;
            box-shadow: 0 0 6px #9e9e9e;
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
