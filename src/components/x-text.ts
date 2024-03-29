import { HTMLComponent } from "../dom"

const template = document.createElement("template")
template.innerHTML = html`
    <style>
        :host {
            font-size: 12px;
            line-height: 14px;
        }
        :host(.header) {
            font-weight: bold;
            text-transform: uppercase;
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
        :host(.size-14) {
            font-size: 14px;
            line-height: 20px;
        }
        :host(.size22) {
            font-size: 22px;
        }
        :host(.size30) {
            font-size: 30px;
        }
        :host(.line16) {
            line-height: 16px;
        }
        :host(.uppercase) {
            text-transform: uppercase;
        }
        :host(.space-2) {
            margin-bottom: 2px;
        }

        :host(.secondary) {
            color: #666;
        }
        :host(.tertiary) {
            color: #787878;
        }
        :host(.red) {
            color: #ff0000;
        }
        :host(.green) {
            color: #4caf50;
        }
        :host(.energy-up) {
            color: #03a9f4;
        }
        :host(.energy-down) {
            color: #9c27b0;
        }
        :host(.health-up) {
            color: #8bc34a;
        }
        :host(.health-down) {
            color: #f44336;
        }
    </style>

    <slot></slot>
`

export class Text extends HTMLComponent {
    constructor() {
        super(template)
    }
}

customElements.define("x-text", Text)
