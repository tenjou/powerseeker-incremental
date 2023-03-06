import { ItemId } from "../../config/item-configs"
import { HTMLComponent } from "../../dom"

const template = document.createElement("template")
template.setAttribute("class", "icon-slot hover-outline inactive-children rarity-xp")
template.innerHTML = html`
    <div id="xp" class="flex flex-1 align-center justify-center height-100 font-8 bold text-shadow-5 color-white">XP</div>
    <div id="value" class="color-white"></div>
`

export class XpIconSlot extends HTMLComponent {
    constructor() {
        super(template)
    }

    update(value: number) {
        this.setText("#value", value)
    }
}

customElements.define("xp-icon-slot", XpIconSlot)
