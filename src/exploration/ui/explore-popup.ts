import { LocationId } from "../../config/location-config"
import { HTMLComponent } from "../../dom"
import { getState } from "../../state"
import { ExplorationService } from "./../exploration-service"
import { subscribe } from "./../../events"

const template = document.createElement("template")
template.innerHTML = html`
    <style>
        .hide {
            display: none;
        }
    </style>

    <popup-container>
        <x-column class="center-h">
            <x-text class="bold size-14">Forest</x-text>
            <x-text class="secondary">What treasures are there?</x-text>
            <x-text class="tertiary">Level 1</x-text>
        </x-column>

        <div id="state-explore" class="hide">
            <x-row id="row-actions" class="center-h p-6">
                <x-button id="explore" class="black">Explore</x-button>
            </x-row>
        </div>

        <div id="state-progress" class="hide">
            <x-row id="row-progress" class="center-h p-20">
                <x-row class="w-256">
                    <progress-bar id="progress" class="blue border" value="0" value-max="100" label="Exploring"></progress-bar>
                </x-row>
            </x-row>
        </div>

        <div id="state-battle" class="hide">
            <x-column>
                <x-text class="bold size-14">Battle</x-text>
                <x-row>
                    <x-card>
                        <x-text class="bold">Slime</x-text>
                        <x-text class="secondary">Level 1</x-text>
                    </x-card>
                </x-row>
            </x-column>

            <x-row id="row-actions" class="center-h p-6">
                <x-button id="battle" class="black">Battle</x-button>
            </x-row>
        </div>
    </popup-container>
`

export class ExplorePopup extends HTMLComponent {
    timer: NodeJS.Timer | null = null

    constructor() {
        super(template)
    }

    connectedCallback() {
        this.update()

        this.timer = setInterval(() => this.updateProgress(), 1000 / 60)
        // const locationId = this.getAttribute("location") as LocationId

        // this.getElement("#explore").onclick = () => {
        //     ExplorationService.explore(locationId)
        //     this.timer = setInterval(() => this.updateProgress(), 1000 / 60)
        //     this.update()
        // }

        // this.update()
    }

    disconnectedCallback() {
        if (this.timer) {
            clearInterval(this.timer)
            this.timer = null
        }
    }

    update() {
        const { exploration } = getState()

        // if (!exploration) {
        //     this.getElement("#explore").onclick = () => {
        //         const locationId = this.getAttribute("location") as LocationId
        //         ExplorationService.explore(locationId)
        //     }
        //     this.toggleClassName("hide", false, "#state-explore")
        //     return
        // }

        // this.toggleClassName("hide", true, "#state-explore")
        // this.toggleClassName("hide", !!exploration.result, "#state-progress")
        // this.toggleClassName("hide", !exploration.result, "#state-battle")

        console.log("update")
    }

    updateProgress() {
        const { exploration } = getState()

        if (!exploration || exploration.result) {
            return
        }

        const tCurrent = Date.now()
        const tElapsed = tCurrent - exploration.tStart
        const percentsPerMs = 100 / (exploration.tEnd - exploration.tStart)
        const percents = percentsPerMs * tElapsed

        this.getElement("#progress").setAttribute("value", String(percents))
    }
}

customElements.define("explore-popup", ExplorePopup)
