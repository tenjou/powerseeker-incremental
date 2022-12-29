import { HTMLComponent } from "../../dom"
import { i18n } from "../../i18n"
import { getState } from "../../state"
import { WorldService } from "./../world-service"

const template = document.createElement("template")
template.innerHTML = html`
    <div id="name" class="font-bold mb-2"></div>
    <div id="exploration-description" class="mb-2">
        This forest is filled with tall trees that block out much of the sunlight, creating a dusky and shadowy atmosphere. The ground is
        soft and spongy underfoot, and there is a sense of mystery and danger lurking just out of sight. This is a place where strange and
        ancient creatures may still roam, and the unwary traveler may become lost forever.
    </div>
    <x-button id="explore" class="black mb-2">Explore</x-button>
    <anim-progress-bar id="explore-progress" value="40" value-max="100" label="Exploring" class="blue border hide"></anim-progress-bar>
    <div id="explore-result" class="hide">
        <div>Combat</div>
        <x-button id="explore-fight" class="black mb-2">Fight</x-button>
    </div>
`

export class ExploreWilderness extends HTMLComponent {
    constructor() {
        super(template)

        this.getElement("#explore").onclick = WorldService.exploreSelected
        this.getElement("#explore-fight").onclick = WorldService.interactExplored
    }

    update() {
        const { exploration } = getState()

        if (exploration) {
            const progressBar = this.getElement("#explore-progress")
            progressBar.setAttrib("start", exploration.tStart)
            progressBar.setAttrib("end", exploration.tEnd)
            progressBar.classList.remove("hide")

            this.getElement("#explore").classList.add("hide")

            if (exploration.result) {
                this.getElement("#explore-result").classList.remove("hide")
            } else {
            }

            console.log(exploration)
        }

        const selectedLocationId = WorldService.getSelectedLocationId()

        this.setText("#name", i18n(selectedLocationId))
    }
}

customElements.define("explore-wilderness", ExploreWilderness)
