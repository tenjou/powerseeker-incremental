import { HTMLComponent } from "../dom"

const template = document.createElement("template")
template.innerHTML = html`<style>
        :host {
            font-weight: 700;
            text-transform: uppercase;
            border-bottom: 1px solid #bfbfbf;
            margin: 0px 5px 5px 2px;
        }

        header-title {
            display: inline-flex;
            padding: 7px 2px 6px;
            margin-bottom: -1px;
            border-bottom: 1px solid black;
        }
    </style>

    <header-title><slot></slot></header-title>`

class Header extends HTMLComponent {
    constructor() {
        super(template)
    }
}

customElements.define("x-header", Header)
