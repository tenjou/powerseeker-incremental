import { AspectService } from "../../aspects/aspect-service"
import { ProgressBar } from "../../components/progress-bar"
import { LevelConfig } from "../../config/level-config"
import { HTMLComponent } from "../../dom"
import { getState } from "../../state"
import { i18n } from "./../../i18n"

const template = document.createElement("template")
template.className = "mb-3 width-250px"
template.innerHTML = html`
    <div id="name" class="mb-2 px-2 bold font-2"></div>

    <div class="flex flex-row ml-2">
        <div class="flex flex-column mr-3">
            <div id="level" class="font-2 "></div>
            <div id="aspect" class="font-2 color-secondary"></div>
        </div>
        <div class="flex flex-column flex-1 justify-center">
            <progress-bar value="24" value-max="100" class="green border"></progress-bar>
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

        const maxExp = LevelConfig[aspect.level]
        this.getElement<ProgressBar>("progress-bar").update({ value: aspect.exp, valueMax: maxExp, showMax: true })

        // this.getElement<StatsRow>("#power-fire").update("fire", battler.stats.firePower, "fire_power_description")
        // this.getElement<StatsRow>("#power-water").update("water", battler.stats.waterPower, "water_power_description")
        // this.getElement<StatsRow>("#power-earth").update("earth", battler.stats.earthPower, "earth_power_description")
        // this.getElement<StatsRow>("#power-air").update("air", battler.stats.airPower, "air_power_description")
    }
}

customElements.define("character-info", CharacterInfo)
