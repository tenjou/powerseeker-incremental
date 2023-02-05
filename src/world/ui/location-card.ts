import { LocationConfig } from "../../config/area-configs"
import { HTMLComponent } from "../../dom"
import { i18n } from "../../i18n"
import { LocationState } from "../world-types"
import { WorldService } from "./../world-service"
import { ProgressBar } from "./../../components/progress-bar"

const template = document.createElement("template")
template.setAttribute("class", "p-2 bg-white hover:outline active:outline border-radius-3 cursor-pointer")
template.innerHTML = html`
    <div id="name" class="bold"></div>
    <div id="description" class="pb-2"></div>
    <progress-bar show-max class="blue border"></progress-bar>
`

export class LocationCard extends HTMLComponent {
    constructor() {
        super(template)
    }

    update(locationConfig: LocationConfig, locationState: LocationState) {
        this.id = `location-${locationConfig.id}`
        this.setText("#name", i18n(locationConfig.id))
        this.setText("#description", i18n(locationConfig.type))

        const progressBar = this.getElement<ProgressBar>("progress-bar")
        progressBar.update({
            value: locationState.progress,
            valueMax: locationConfig.progressMax,
            showPercents: true,
        })

        this.onclick = () => WorldService.progressLocation(locationConfig.id, 2)
    }
}

customElements.define("location-card", LocationCard)
