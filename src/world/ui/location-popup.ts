import { HTMLComponent } from "../../dom"
import { subscribe } from "../../events"
import { ItemIconSlot } from "../../inventory/ui/item-icon-slot"
import { getState } from "../../state"
import { LocationConfigs, LocationId } from "./../../config/location-configs"
import { unsubscribe } from "./../../events"
import { i18n } from "./../../i18n"
import { XpIconSlot } from "./../../inventory/ui/xp-icon-slot"
import { WorldService } from "./../world-service"
import { LocationStatus } from "./location-status"
import { setTooltip } from "./../../tooltip"

const template = document.createElement("template")
template.innerHTML = html`
    <div class="popup flex flex-column">
        <div class="flex flex-row mb-2">
            <div class="flex flex-column flex-1">
                <div id="name" class="font-2 bold"></div>
                <div id="type" class="font-1 color-secondary"></div>
            </div>
            <div id="level" class="font-2"></div>
        </div>

        <div id="description" class="mb-2"></div>

        <div class="flex flex-column mb-3">
            <div class="mb-1">
                <span class="bold">${i18n("rewards")}</span>
                <span id="rewards-status" class="font-1 color-secondary">(${i18n("received")})</span>
            </div>

            <div id="rewards" class="flex flex-row gap-1"></div>
        </div>

        <div class="flex flex-column mb-6">
            <div id="progress-text" class="mb-1 bold"></div>
            <location-status></location-status>
        </div>

        <div class="flex justify-center">
            <div id="interact" class="button mb-2"></div>
        </div>
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
        const locationCfg = LocationConfigs[locationId]
        const locationState = locations[locationId]

        if (locationId !== this.currLocationId) {
            this.setText("#name", i18n(locationCfg.id))
            this.setText("#type", i18n(locationCfg.type))
            this.setText("#description", i18n(`${locationCfg.id}_description`))
            this.setText("#level", `${i18n("level")} ${locationCfg.level}`)

            const receivedRewards = locationState.completedAt > 0 && locationCfg.type === "battle"
            this.toggleClassName("hidden", !receivedRewards, "#rewards-status")

            const rewardsElement = this.getElement("#rewards", true)
            for (const reward of locationCfg.loot) {
                const itemIcon = new ItemIconSlot()
                itemIcon.updateByItemId(reward.itemId, reward.min, reward.max)
                rewardsElement.appendChild(itemIcon)

                setTooltip(itemIcon, ":item-id")
            }

            this.currLocationId = locationId
        }

        const showRespawn = locationState.progress >= locationCfg.progressMax && locationState.resetAt > 0
        const defaultProgressText = locationCfg.type === "gathering" ? "attempts" : "progress"
        this.setText("#progress-text", i18n(showRespawn ? "respawn" : defaultProgressText))

        const locationStatus = this.getElement<LocationStatus>("location-status")
        locationStatus.update(locationCfg, locationState)

        const interactText = locationCfg.type === "gathering" ? "gather" : "battle"
        this.setText("#interact", i18n(interactText))
        this.toggleClassName("disabled", showRespawn, "#interact")
    }
}

customElements.define("location-popup", LocationPopup)
