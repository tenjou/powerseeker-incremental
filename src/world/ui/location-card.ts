import { LocationConfig } from "../../config/location-configs"
import { HTMLComponent } from "../../dom"
import { i18n } from "../../i18n"
import { openPopup } from "../../popup"
import { LocationState } from "../world-types"
import { LocationStatus } from "./location-status"

const template = document.createElement("template")
template.setAttribute("class", "p-2 bg-white hover:outline active:outline border-radius-3 cursor-pointer")
template.innerHTML = html`
    <div class="flex flex-row">
        <div class="flex flex-column">
            <div id="name" class="bold"></div>
            <div id="description" class="pb-2 color-secondary"></div>
        </div>
        <div class="flex flex-1 justify-end">
            <div id="level"></div>
        </div>
    </div>
    <location-status></location-status>
`

export class LocationCard extends HTMLComponent {
    constructor() {
        super(template)
    }

    update(locationConfig: LocationConfig, locationState: LocationState) {
        this.id = `location-${locationConfig.id}`
        this.setText("#name", i18n(locationConfig.id))
        this.setText("#description", i18n(locationConfig.type))
        this.setText("#level", `${i18n("level")} ${locationConfig.level}`)

        const element = this.getElement<LocationStatus>("location-status")
        element.update(locationConfig, locationState)

        this.onclick = () =>
            openPopup("location-popup", {
                locationId: locationConfig.id,
            })
    }
}

customElements.define("location-card", LocationCard)
