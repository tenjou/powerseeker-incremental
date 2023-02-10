import { HTMLComponent } from "../../dom"
import { i18n } from "../../i18n"
import { LocationState } from "../world-types"
import { WorldService } from "./../world-service"
import { ProgressBar } from "./../../components/progress-bar"
import { LocationConfig } from "../../config/location-configs"
import { XTimer } from "../../components/x-timer"

const template = document.createElement("template")
template.setAttribute("class", "p-2 bg-white hover:outline active:outline border-radius-3 cursor-pointer")
template.innerHTML = html`
    <div id="name" class="bold"></div>
    <div id="description" class="pb-2 color-secondary"></div>
    <div id="status"><x-timer /></div>
    <progress-bar show-max></progress-bar>
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
                progressBar.className = "border blue"
                progressBar.update({
                    value: locationState.progress,
                    valueMax: locationConfig.progressMax,
                    showPercents: true,
                })
                break
            }

            case "resource": {
                if (locationState.progress >= locationConfig.progressMax) {
                    const tEnd = locationState.startedAt + locationConfig.cooldown

                    this.getElement<XTimer>("x-timer").update(tEnd, () => {
                        WorldService.updateLocation(locationConfig.id, locationConfig, true)
                    })

                    this.toggleClassName("hide", false, "#status")
                } else {
                    const progressBar = this.getElement<ProgressBar>("progress-bar")
                    progressBar.className = "border green"
                    progressBar.update({
                        value: locationState.progress,
                        valueMax: locationConfig.progressMax,
                        showPercents: true,
                    })
                }

                break
            }
        }

        this.onclick = () => WorldService.interact(locationConfig.id)
    }
}

customElements.define("location-card", LocationCard)
