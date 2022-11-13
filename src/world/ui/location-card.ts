import { HTMLComponent } from "../../dom"
import { LocationConfigs, LocationId } from "./../../config/location-config"
import { i18n } from "./../../local"
import { LocationService } from "./../location-service"

const template = document.createElement("template")
template.innerHTML = html`<x-card>
    <x-row id="unknown" class="center-h"><x-text class="tertiary">???</x-text></x-row>
    <x-row id="info">
        <x-column class="flex"><x-text id="name" class="bold"></x-text><x-text id="level" class="tertiary"></x-text></x-column>
        <x-row class="flex center-v w-128">
            <progress-bar id="progress" value="0" value-max="50" show-max class="blue border"></progress-bar>
        </x-row>
    </x-row>
</x-card>`

export class LocationCard extends HTMLComponent {
    constructor() {
        super(template)
    }

    connectedCallback() {
        this.update()
    }

    update() {
        const locationAttrib = this.getAttribute("location")

        this.toggleClassName("hide", !!locationAttrib, "#unknown")
        this.toggleClassName("hide", !locationAttrib, "#info")
        this.toggleClassName("inactive", !locationAttrib)

        if (locationAttrib) {
            const locationId = locationAttrib as LocationId
            const locationConfig = LocationConfigs[locationId]
            const location = LocationService.get(locationId)

            this.setText("#name", i18n(locationConfig.id))
            this.setText("#level", `${i18n("level")} ${locationConfig.level}`)
            this.getElement("#progress").setAttribute("value", String(location?.progress))

            this.onclick = () => {
                LocationService.explore(locationId)
            }
        }
    }
}

customElements.define("location-card", LocationCard)
