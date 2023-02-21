import { HTMLComponent } from "../../dom"
import { i18n } from "../../i18n"

const template = document.createElement("template")
template.className = "flex flex-row py-half px-2"
template.innerHTML = html`
    <div id="key" class="flex-1 mr-1 color-secondary"></div>
    <div id="value" class="bold"></div>
`

export class StatsRow extends HTMLComponent {
    constructor() {
        super(template)
    }

    update(key: string, value: string | number) {
        this.getElement("#key").innerText = i18n(key)
        this.getElement("#value").innerText = value.toString()
    }
}

customElements.define("stats-row", StatsRow)
