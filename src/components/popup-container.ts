import { HTMLComponent } from "../dom"

const popupContainerTemplate = document.createElement("template")
popupContainerTemplate.innerHTML = html`<style>
        :host {
            display: flex;
            flex-direction: column;
            padding: 8px;
            width: 400px;
            max-height: 96%;
            box-sizing: border-box;
            box-shadow: 0 0 2px rgba(0, 0, 0, 0.83);
            background: linear-gradient(#d6d6d6, #efefef);
            border-radius: 3px;
            border-left: 2px solid #fff;
            border-right: 2px solid #fff;
        }
    </style>
    <slot></slot>`

customElements.define(
    "popup-container",
    class extends HTMLComponent {
        constructor() {
            super(popupContainerTemplate)
        }
    }
)
