import { XTimer } from "../../components/x-timer"
import { LocationConfig } from "../../config/location-configs"
import { HTMLComponent } from "../../dom"
import { i18n } from "../../i18n"
import { LocationState } from "../world-types"
import { ProgressBar } from "./../../components/progress-bar"
import { WorldService } from "./../world-service"

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
    <div id="status">
        <div id="status-text"></div>
        <x-timer />
    </div>
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
        this.setText("#status-text", "")
        this.setText("#level", `${i18n("level")} ${locationConfig.level}`)

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

            case "resource": {
                if (locationState.progress >= locationConfig.progressMax) {
                    const tEnd = locationState.startedAt + locationConfig.cooldown
                    this.getElement<XTimer>("x-timer").update(tEnd)

                    this.toggleClassName("hide", false, "#status")
                    this.toggleClassName("hide", false, "x-timer")
                } else {
                    const progressBar = this.getElement<ProgressBar>("progress-bar")
                    progressBar.className = "border green width-anim"
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
