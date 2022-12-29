import { HTMLComponent } from "./../dom"

const template = document.createElement("template")
template.innerHTML = html`
    <div class="bar shadow"></div>
    <div id="progress" class="bar"></div>
    <div id="value" class="value"></div>
`

export class ProgressBar extends HTMLComponent {
    constructor() {
        super(template)
    }

    update() {
        const value = Number(this.getAttribute("value"))
        const valueMax = Number(this.getAttribute("value-max"))
        const showMax = this.haveAttribute("show-max")
        const label = this.getAttribute("label")

        let percents = ((100 / valueMax) * value) | 0
        if (percents > 100) {
            percents = 100
        } else if (percents < 0) {
            percents = 0
        }

        if (label) {
            this.setText("#value", label)
        } else {
            this.setText("#value", showMax ? `${value} / ${valueMax}` : `${value}`)
        }
        this.getElement("#progress").style.width = `${percents}%`
    }

    static get observedAttributes() {
        return ["value", "value-max", "show-max", "label"]
    }
}

customElements.define("progress-bar", ProgressBar)
