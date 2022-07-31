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

        const { battle } = getState()

        this.getElement("close-button").onclick = () => {
            unloadBattle()
            closePopup()
        }
        this.setText("#result", "Defeat!")

        // const isVictory = isTeamDead(battle.isTeamA ? battle.teamB : battle.teamA)
        // se("battle-result-text", isVictory ? "Victory!" : "Defeat!")
    }
}

customElements.define("battle-result-popup", BattleResultPopup)
