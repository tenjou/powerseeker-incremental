import { HTMLComponent } from "../../dom"
import { i18n } from "../../local"
import { openPopup } from "../../popup"
import { Entity } from "../exploration-types"
import { ExplorationService } from "../exploration-service"

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
    entity: Entity = {} as Entity

    connectedCallback() {
        super.connectedCallback(template)
    }

    update(entity: Entity) {
        this.entity = entity

        this.setText("#name", i18n(entity.entityId))
        this.setText("#type", i18n(entity.entityId))
    }
}

customElements.define("entity-card", EntityCard)
