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

const template = document.createElement("template")
template.innerHTML = html`<popup-container>
    <x-row class="center-h">
        <x-text class="header size30">Victory</x-text>
    </x-row>

    <x-row class="center-h">
        <close-button></close-button>
    </x-row>
</popup-container>`

customElements.define(
    "battle-result-popup",
    class extends HTMLComponent {
        constructor() {
            super(template)

            this.getElement("close-button").onclick = () => {
                this.remove()
            }
        }
    }
)

export function addPopup() {
    const popup = document.createElement("battle-result-popup")
    document.getElementById("popups")?.appendChild(popup)

    console.log("add")
}
