import { JobId } from "../../config/job-configs"
import { HTMLComponent } from "../../dom"
import { goTo } from "../../view"
import { JobsService } from "../jobs-service"
import { i18n } from "../../i18n"
import { LevelConfig } from "./../../config/level-config"

const template = document.createElement("template")
template.innerHTML = html`
    <x-row class="colored">
        <x-column class="flex center-v">
            <x-text id="name" class="bold"></x-text>
            <x-text id="level" class="tertiary"></x-text>
        </x-column>
        <x-column class="flex center-v w-128 pl-6 pr-6">
            <progress-bar id="exp" value="0" value-max="100" show-max class="green border"></progress-bar>
        </x-column>
        <x-row>
            <x-button id="select" class="black">Select</x-button>
        </x-row>
    </x-row>
`

export class JobSlot extends HTMLComponent {
    constructor() {
        super(template)
    }

    connectedCallback() {
        this.update()
    }

    update() {
        const jobId = this.getAttribute("job-id") as JobId
        const job = JobsService.getJob(jobId)

        if (jobId) {
            const isPrimary = Boolean(this.getAttribute("primary"))

            this.setText("#name", i18n(jobId))
            this.setText("#level", `Level ${job.level}`)

            const progressBar = this.getElement("#exp")
            progressBar.setAttribute("value", String(job.exp))
            progressBar.setAttribute("value-max", String(LevelConfig[job.level]))

            this.getElement("#select").onclick = () => {
                if (isPrimary) {
                    JobsService.selectPrimaryJob(jobId)
                } else {
                    JobsService.selectSecondaryJob(jobId)
                }

                goTo("/character")
            }
        } else {
            this.toggleClassName("hide", true, "#name")
            this.setText("#level", i18n("none"))
        }
    }
}

customElements.define("job-slot", JobSlot)
