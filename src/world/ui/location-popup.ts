import { HTMLComponent } from "../../dom"
import { subscribe } from "../../events"
import { ItemIconSlot } from "../../inventory/ui/item-icon-slot"
import { getState } from "../../state"
import { LocationConfigs, LocationId } from "./../../config/location-configs"
import { i18n } from "./../../i18n"
import { WorldService } from "./../world-service"
import { LocationStatus } from "./location-status"
import { unsubscribe } from "./../../events"

const template = document.createElement("template")
template.innerHTML = html`
    <style></style>

    <div class="popup flex flex-column align-center">
        <div id="name" class="bold"></div>
        <div id="type" class="tertiary"></div>
        <div id="description" class="tertiary mb-2"></div>

        <div class="flex flex-column align-center width-60 mb-4">
            <div id="type" class="tertiary mb-1 bold">Rewards</div>
            <item-icon-slot></item-icon-slot>
        </div>
        <div class="flex flex-column align-center width-60 mb-4">
            <div id="type" class="tertiary mb-1 bold">Progress</div>
            <location-status class="justify-center"></location-status>
        </div>

        <div id="interact" class="button"></div>
    </div>
`

export class LocationPopup extends HTMLComponent {
    onLocationUpdated: (locationId: LocationId) => void

    constructor() {
        super(template)
    }

    connectedCallback(): void {
        super.connectedCallback()

        const locationId = this.getAttrib("locationId")

        this.update(locationId)

        this.getElement("#interact").onclick = () => {
            WorldService.interact(locationId)
        }

        this.onLocationUpdated = subscribe("location-updated", (locationUpdatedId) => {
            if (locationUpdatedId === locationId) {
                this.update(locationId)
            }
        })
    }

    disconnectedCallback() {
        unsubscribe("location-updated", this.onLocationUpdated)
    }

    update(locationId: LocationId) {
        const { locations } = getState()

        const locationConfig = LocationConfigs[locationId]
        const locationState = locations[locationId]

        this.setText("#name", i18n(locationConfig.id))
        this.setText("#type", i18n(locationConfig.type))
        this.setText("#description", i18n(`${locationConfig.id}_description`))

        const locationStatus = this.getElement<LocationStatus>("location-status")
        locationStatus.update(locationConfig, locationState)

        const itemIcon = this.getElement<ItemIconSlot>("item-icon-slot")
        itemIcon.updateByItemId("copper_ore", 3)

        const interactText = locationConfig.type === "resource" ? "gather" : "battle"
        this.setText("#interact", i18n(interactText))
    }
}

customElements.define("location-popup", LocationPopup)
