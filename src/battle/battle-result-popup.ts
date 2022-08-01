import { HTMLComponent } from "../dom"
import { closePopup } from "../popup"
import { getState } from "../state"
import { unloadBattle } from "./battle"

const template = document.createElement("template")
template.innerHTML = html`<popup-container>
    <x-row class="center-h">
        <x-text id="result" class="header size30"></x-text>
    </x-row>

    <x-row class="center-h">
        <close-button></close-button>
    </x-row>
</popup-container>`

export class BattleResultPopup extends HTMLComponent {
    constructor() {
        super(template)

        const { battleResult } = getState()

        this.getElement("close-button").onclick = () => {
            unloadBattle()
            closePopup()
        }

        if (!battleResult) {
            return
        }

        this.setText("#result", battleResult.isVictory ? "Victory!" : "Defeat!")
    }
}

customElements.define("battle-result-popup", BattleResultPopup)
