import { HTMLComponent } from "../../dom"
import { Entity } from "../entity-types"
import { i18n } from "./../../local"

const template = document.createElement("template")
template.innerHTML = html`
    <x-card>
        <x-column class="flex center-v">
            <x-text id="name" class="bold"></x-text>
            <x-text id="type" class="tertiary"></x-text>
        </x-column>
    </x-card>
`

export class EntityCard extends HTMLComponent {
    constructor() {
        super(template)
    }

    update(entity: Entity) {
        this.setText("#name", i18n(entity.id))
        this.setText("#type", i18n(entity.id))
    }
}

customElements.define("entity-card", EntityCard)
