import { HTMLComponent } from "../../dom"
import { i18n } from "../../i18n"
import { LocationState } from "../world-types"
import { WorldService } from "./../world-service"
import { ProgressBar } from "./../../components/progress-bar"
import { LocationConfig } from "../../config/location-configs"

const template = document.createElement("template")
template.setAttribute("class", "p-2 bg-white hover:outline active:outline border-radius-3 cursor-pointer")
template.innerHTML = html`
    <div id="name" class="bold"></div>
    <div id="description" class="pb-2 color-secondary"></div>
    <div id="status"></div>
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

        this.toggleClassName("hide", true, "#status")
        this.toggleClassName("hide", true, "progress-bar")

        switch (locationConfig.type) {
            case "battle": {
                const progressBar = this.getElement<ProgressBar>("progress-bar")
                progressBar.update({
                    value: locationState.progress,
                    valueMax: locationConfig.progressMax,
                    showPercents: true,
                })
                this.toggleClassName("hide", false, "progress-bar")
                break
            }

            case "resource": {
                const progressBar = this.getElement<ProgressBar>("progress-bar")
                progressBar.update({
                    value: locationState.progress,
                    valueMax: locationConfig.progressMax,
                    showPercents: true,
                })
                this.toggleClassName("hide", false, "progress-bar")

                // this.setText("#status", "Cooldown")
                // this.toggleClassName("hide", false, "#status")
                break
            }
        }

        this.onclick = () => WorldService.interact(locationConfig.id)
    }
}

customElements.define("location-card", LocationCard)
