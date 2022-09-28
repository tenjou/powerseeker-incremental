import { JobId } from "../../config/job-configs"
import { HTMLComponent } from "../../dom"
import { goTo } from "../../view"
import { JobsService } from "../jobs-service"
import { i18n } from "./../../local"

const template = document.createElement("template")
template.innerHTML = html`<style>
        :host {
            margin: 3px 0;
            padding: 6px;
            background: #e9e7e7;
            border-radius: 3px;
        }
    </style>

    <x-row>
        <x-column class="flex center-v">
            <x-text id="name" class="bold"></x-text>
            <x-text id="level" class="tertiary"></x-text>
        </x-column>
        <x-row>
            <x-button id="select" class="black">Select</x-button>
        </x-row>
    </x-row>`

export class JobSlot extends HTMLComponent {
    constructor() {
        super(template)
    }

    connectedCallback() {
        this.update()
    }

    attributeChangedCallback() {
        this.update()
    }

    update() {
        const jobId = this.getAttribute("job-id") as JobId
        const job = JobsService.getJob(jobId)

        if (jobId) {
            const isPrimary = Boolean(this.getAttribute("primary"))

            this.setText("#name", i18n(jobId))
            this.setText("#level", `Level ${job.level}`)

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

    static get observedAttributes() {
        return ["job-id"]
    }
}

customElements.define("job-slot", JobSlot)