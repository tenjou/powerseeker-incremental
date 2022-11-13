import { HTMLComponent } from "../dom"

const template = document.createElement("template")
template.innerHTML = html`<style>
        :host {
            position: relative;
            display: flex;
            flex-direction: row;
            border-radius: 3px;
            flex: 0 0 200px;
            min-height: 40px;
            background: #f5f3f3;
            cursor: pointer;
            border: 1px solid #878787;
        }
        :host(:hover) {
            background: #fff;
            outline: 2px solid white;
        }
        :host(.inactive) {
            opacity: 0.5;
            pointer-events: none;
        }
        :host(:active) {
            transform: translateY(1px);
        }
    </style>

    <x-column class="center-v ml-2 mr-2 flex">
        <slot></slot>
    </x-column>`

export class XCard extends HTMLComponent {
    constructor() {
        super(template)
    }
}

customElements.define("x-card", XCard)
