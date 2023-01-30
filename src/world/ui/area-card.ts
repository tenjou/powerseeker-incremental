import { HTMLComponent } from "../../dom"
import { i18n } from "../../i18n"
import { AreaConfigs, AreaId } from "../../config/area-configs"

const template = document.createElement("template")
template.setAttribute("class", "p-2 bg-white hover:outline active:outline border-radius-3 cursor-pointer")
template.innerHTML = html`
    <div id="name" clas="font-bold"></div>
`

export class AreaCard extends HTMLComponent {
    constructor() {
        super(template)
    }

    connectedCallback() {
        super.connectedCallback()

        this.update()
    }

    update() {
        const area = this.getAttribute("area") as AreaId

        const areaConfig = AreaConfigs[area]

        this.setText("#name", i18n(areaConfig.id))
    }
}

customElements.define("area-card", AreaCard)
