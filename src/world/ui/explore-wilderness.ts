import { HTMLComponent } from "../../dom"
import { i18n } from "../../local"
import { getState } from "../../state"
import { WorldService } from "./../world-service"

const template = document.createElement("template")
template.innerHTML = html`
    <div id="name" class="font-bold mb-2"></div>
    <x-button id="explore" class="black mb-2">Explore</x-button>
    <anim-progress-bar id="explore-progress" value="40" value-max="100" label="Exploring" class="blue border hide"></anim-progress-bar>
`

export class ExploreWilderness extends HTMLComponent {
    connectedCallback() {
        super.connectedCallback(template)

        this.getElement("#explore").onclick = WorldService.exploreSelected
    }

    update() {
        const { exploration } = getState()

        if (exploration) {
            const progressBar = this.getElement("#explore-progress")
            progressBar.setAttrib("start", exploration.tStart)
            progressBar.setAttrib("end", exploration.tEnd)
            progressBar.classList.remove("hide")

            this.getElement("#explore").classList.add("hide")
        }

        const selectedLocationId = WorldService.getSelectedLocationId()

        this.setText("#name", i18n(selectedLocationId))
    }
}

customElements.define("explore-wilderness", ExploreWilderness)
