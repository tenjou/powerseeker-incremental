import { AspectService } from "../../aspects/aspect-service"
import { ProgressBar } from "../../components/progress-bar"
import { SpBar } from "../../components/sp-bar"
import { LevelConfig } from "../../config/level-config"
import { HTMLComponent } from "../../dom"
import { getState } from "../../state"
import { i18n } from "./../../i18n"

const template = document.createElement("template")
template.className = "mb-3 width-350px"
template.innerHTML = html`
    <div id="name" class="mb-2 px-2 bold font-2"></div>

    <div class="flex flex-row ml-2">
        <div class="flex flex-column mr-3">
            <div id="level" class="font-2 "></div>
            <div id="aspect" class="font-2 color-secondary"></div>
        </div>
        <div class="flex flex-column flex-1 justify-center mr-1">
            <progress-bar value="24" value-max="100" class="green border"></progress-bar>
        </div>
        <div class="flex align-center m-2">
            <sp-bar></sp-bar>
        </div>
    </div>
`

export class CharacterInfo extends HTMLComponent {
    constructor() {
        super(template)
    }

    update() {
        const { player } = getState()

        const aspect = AspectService.get(player.aspectId)

        this.setText("#name", player.name)
        this.setText("#level", `${i18n("level")} ${aspect.level}`)
        this.setText("#aspect", i18n(player.aspectId))

        const maxExp = LevelConfig[aspect.level - 1]
        if (maxExp) {
            this.getElement<ProgressBar>("progress-bar").update({ value: aspect.exp, valueMax: maxExp, showMax: true })
        } else {
            this.getElement<ProgressBar>("progress-bar").update({ value: 1, valueMax: 1, label: i18n("max_level") })
        }

        this.getElement<SpBar>("sp-bar").update(player.sp)
    }
}

customElements.define("character-info", CharacterInfo)
