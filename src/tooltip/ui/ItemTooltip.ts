import { HTMLComponent } from "../../dom"

const template = document.createElement("template")
template.innerHTML = html`
    <div class="flex bold">
        <span>Master Axe</span>
        <span class="flex-1"></span>
        <span class="">Uncommon Tier 1</span>
    </div>
    <div class="flex flex-row color-gray">
        <span>One-Hand</span>
        <span class="flex-1"></span>
        <span>Axe</span>
    </div>

    <div class="spacing-6"></div>

    <div class="color-gold">Power 12</div>

    <div class="spacing-6"></div>

    <div>
        <span>+16</span>
        <span class="color-gray">Damage</span>
    </div>
    <div>
        <span>+10</span>
        <span class="color-gray">Strength</span>
    </div>
    <div>
        <span>+3</span>
        <span class="color-gray">Dexterity</span>
    </div>

    <div class="spacing-6"></div>

    <div class="color-gray">An axe is a powerful weapon and tool that can be wielded one or two-handed.</div>
`

export class ItemTooltip extends HTMLComponent {
    constructor() {
        super(template)
    }

    update() {}
}

customElements.define("item-tooltip", ItemTooltip)
