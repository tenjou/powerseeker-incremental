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
        :host(.inline) {
            display: inline-flex;
        }
        :host(.margin5) {
            margin: 5px;
        }
        :host(.w-64) {
            flex: 0 0 64px;
        }
        :host(.w-128) {
            flex: 0 0 128px;
        }
        :host(.w-128) {
            flex: 0 0 128px;
        }
        :host(.m-1) {
            margin: 0.35rem;
        }
        :host(.pl-6) {
            padding-left: 1.5rem;
        }
        :host(.pr-6) {
            padding-right: 1.5rem;
        }
    </style>

    <slot></slot>`

class Column extends HTMLComponent {
    constructor() {
        super(template)
    }
}

customElements.define("x-column", Column)
