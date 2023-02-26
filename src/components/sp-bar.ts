import { HTMLComponent } from "../dom"
import { i18n } from "../i18n"

const template = document.createElement("template")
template.className =
    "flex flex-row min-width-70px height-19px align-center bg-white border-1 border-radius-3 inactive-children cursor-pointer"
template.innerHTML = html`
    <span class="px-1 ml-px bg-gray bold border-radius-3">${i18n("sp")}</span>
    <span id="amount" class="px-1 flex-1 text-right bold"></span>
`

export class SpBar extends HTMLComponent {
    constructor() {
        super(template)
    }

    connectedCallback(): void {
        super.connectedCallback()

        this.setAttrib("tooltip", "sp_description")
    }

    update(amount: number) {
        this.setText("#amount", amount)
    }
}

customElements.define("sp-bar", SpBar)
