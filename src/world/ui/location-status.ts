import { XTimer } from "../../components/x-timer"
import { LocationConfig } from "../../config/location-configs"
import { HTMLComponent } from "../../dom"
import { LocationState } from "../world-types"
import { ProgressBar } from "./../../components/progress-bar"

const template = document.createElement("template")
template.className = "flex width-100"
template.innerHTML = html`
    <div id="status" class="flex flex-column justify-center height-19px">
        <div id="status-text"></div>
        <x-timer class="font-1" />
    </div>
    <progress-bar show-max></progress-bar>
`

export class LocationStatus extends HTMLComponent {
    constructor() {
        super(template)
    }

    update(locationConfig: LocationConfig, locationState: LocationState) {
        this.setText("#status-text", "")

        this.toggleClassName("hide", true, "#status")
        this.toggleClassName("hide", true, "progress-bar")
        this.toggleClassName("hide", true, "x-timer")

        switch (locationConfig.type) {
            case "battle": {
                const progressBar = this.getElement<ProgressBar>("progress-bar")
                progressBar.className = "border blue width-anim"
                progressBar.update({
                    value: locationState.progress,
                    valueMax: locationConfig.progressMax,
                    showPercents: true,
                })
                break
            }

            case "boss": {
                if (locationState.startedAt === 0) {
                    this.setText("#status-text", "Available")
                } else {
                    const tEnd = locationState.startedAt + locationConfig.cooldown
                    this.getElement<XTimer>("x-timer").update(tEnd)
                    this.toggleClassName("hide", false, "x-timer")
                }
                this.toggleClassName("hide", false, "#status")
                break
            }

            case "gathering": {
                if (locationState.progress >= locationConfig.progressMax) {
                    const tEnd = locationState.startedAt + locationConfig.cooldown
                    this.getElement<XTimer>("x-timer").update(tEnd)
                    this.toggleClassName("hide", false, "#status")
                    this.toggleClassName("hide", false, "x-timer")
                } else {
                    const progressBar = this.getElement<ProgressBar>("progress-bar")
                    progressBar.className = "border green width-anim"
                    progressBar.update({
                        value: locationConfig.progressMax - locationState.progress,
                        valueMax: locationConfig.progressMax,
                        showMax: true,
                    })
                }
                break
            }
        }
    }
}

customElements.define("location-status", LocationStatus)
