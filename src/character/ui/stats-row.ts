import { HTMLComponent } from "../../dom"
import { i18n } from "../../i18n"

const template = document.createElement("template")
template.className = "flex flex-row align-center py-half px-2 cursor-pointer inactive-children"
template.innerHTML = html`
    <div id="key" class="flex-1 mr-1 color-secondary"></div>
    <div id="value" class="bold"></div>
`

export class StatsRow extends HTMLComponent {
    constructor() {
        super(template)
    }

    update(key: string, value: string | number, postFix: string = "") {
        this.setAttrib("tooltip", `${key}_description`)
        this.getElement("#key").innerText = i18n(key)
        this.getElement("#value").innerText = `${value}${postFix}`
    }
}

customElements.define("stats-row", StatsRow)
