import { LocationConfigs, LocationId } from "../../config/location-config"
import { HTMLComponent } from "../../dom"
import { i18n } from "../../i18n"

const template = document.createElement("template")
template.setAttribute("class", "p-2 bg-white hover:outline active:outline border-radius-3 cursor-pointer")
template.innerHTML = html`
    <div id="name" clas="font-bold"></div>
`

export class LocationCard extends HTMLComponent {
    constructor() {
        super(template)
    }

    connectedCallback() {
        super.connectedCallback()

        this.update()
    }

    update() {
        const location = this.getAttribute("location") as LocationId

        const locationConfig = LocationConfigs[location]

        this.setText("#name", i18n(locationConfig.id))
    }
}

customElements.define("location-card", LocationCard)
