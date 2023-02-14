import { HTMLComponent } from "../../dom"
import { subscribe } from "../../events"
import { ItemIconSlot } from "../../inventory/ui/item-icon-slot"
import { getState } from "../../state"
import { LocationConfig, LocationConfigs, LocationId } from "./../../config/location-configs"
import { i18n } from "./../../i18n"
import { WorldService } from "./../world-service"
import { LocationStatus } from "./location-status"
import { unsubscribe } from "./../../events"
import { LocationState } from "../world-types"

const template = document.createElement("template")
template.innerHTML = html`
    <style></style>

    <div class="popup flex flex-column align-center">
        <div id="name" class="bold"></div>
        <div id="type" class="tertiary"></div>
        <div id="level" class="tertiary mb-2 font-1">Level 1</div>
        <div id="description" class="tertiary mb-2"></div>

        <div class="flex flex-column align-center width-60 mb-3">
            <div id="type" class="tertiary mb-1 bold">Rewards</div>
            <div id="rewards" class="flex flex-row justify-center"></div>
        </div>

        <div class="flex flex-column align-center width-60 mb-5">
            <div id="progress-text" class="tertiary mb-1 bold"></div>
            <location-status class="justify-center"></location-status>
        </div>

        <div id="interact" class="button mb-2"></div>
    </div>
`

export class LocationPopup extends HTMLComponent {
    onLocationUpdated: (locationId: LocationId) => void
    currLocationId: LocationId = ""

    constructor() {
        super(template)
    }

    connectedCallback(): void {
        super.connectedCallback()

        this.update()

        this.getElement("#interact").onclick = () => {
            WorldService.interact(this.currLocationId)
        }

        this.onLocationUpdated = subscribe("location-updated", (locationUpdatedId) => {
            if (locationUpdatedId === this.currLocationId) {
                this.update()
            }
        })
    }

    disconnectedCallback() {
        unsubscribe("location-updated", this.onLocationUpdated)
    }

    update() {
        const { locations } = getState()

        const locationId = this.getAttrib("locationId")
        const locationConfig = LocationConfigs[locationId]
        const locationState = locations[locationId]

        if (locationId !== this.currLocationId) {
            this.setText("#name", i18n(locationConfig.id))
            this.setText("#type", i18n(locationConfig.type))
            this.setText("#description", i18n(`${locationConfig.id}_description`))
            this.setText("#level", `${i18n("level")} ${locationConfig.level}`)

            if (locationConfig.type === "resource") {
                const rewardsElement = this.getElement("#rewards", true)

                for (const reward of locationConfig.loot) {
                    const itemIcon = new ItemIconSlot()
                    itemIcon.updateByItemId(reward.itemId, reward.min, reward.max)
                    rewardsElement.appendChild(itemIcon)
                }
            }

            this.currLocationId = locationId
        }

        const showRespawn = locationState.progress >= locationConfig.progressMax && locationState.resetAt > 0
        this.setText("#progress-text", i18n(showRespawn ? "respawn" : "progress"))

        const locationStatus = this.getElement<LocationStatus>("location-status")
        locationStatus.update(locationConfig, locationState)

        const interactText = locationConfig.type === "resource" ? "gather" : "battle"
        this.setText("#interact", i18n(interactText))
        this.toggleClassName("disabled", showRespawn, "#interact")
    }
}

customElements.define("location-popup", LocationPopup)
