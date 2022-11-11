import { HTMLComponent } from "../../dom"
import { LocationConfigs, LocationId } from "./../../config/location-config"
import { i18n } from "./../../local"
import { LocationService } from "./../location-service"

const template = document.createElement("template")
template.innerHTML = html`<style>
        :host {
            position: relative;
            display: flex;
            flex-direction: row;
            border-radius: 3px;
            flex: 0 0 200px;
            min-height: 40px;
            background: #f5f3f3;
            cursor: pointer;
            border: 1px solid #444;
        }
        :host(:hover) {
            background: #fff;
            outline: 2px solid white;
        }
        :host(.inactive) {
            opacity: 0.5;
            pointer-events: none;
        }
        :host(:active) {
            transform: translateY(1px);
        }

        .hide {
            display: none;
        }
    </style>

    <x-column class="center-v ml-2 mr-2 flex">
        <x-row id="unknown" class="center-h"><x-text class="tertiary">???</x-text></x-row>
        <x-row id="info">
            <x-column class="flex"><x-text id="name" class="bold"></x-text><x-text id="level" class="tertiary"></x-text></x-column>
            <x-row class="flex center-v w-128">
                <progress-bar id="progress" value="0" value-max="50" class="blue"></progress-bar>
            </x-row>
        </x-row>
    </x-column> `

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
                LocationService.addProgress(locationId, 10)
            }
        }
    }
}

customElements.define("location-card", LocationCard)
