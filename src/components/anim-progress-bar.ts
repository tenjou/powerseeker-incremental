import { ProgressBar } from "./progress-bar"

export class AnimProgressBar extends ProgressBar {
    interval: number = -1
    tStart: number = 0
    tEnd: number = 0
    prevPercents: number = 0

    connectedCallback() {
        super.connectedCallback()

        this.setAttrib("value", "0")
        this.setAttrib("value-max", "100")
        this.interval = setInterval(() => this.update(), 1000 / 60)
    }

    disconnectedCallback() {
        if (this.interval > -1) {
            clearInterval(this.interval)
            this.interval = -1
        }
    }

    attributeChangedCallback() {
        this.tStart = Number(this.getAttrib("start"))
        this.tEnd = Number(this.getAttrib("end"))

        this.update()
    }

    update() {
        if (this.tStart > 0 && this.tEnd > 0) {
            const tCurrent = Date.now()
            const tElapsed = tCurrent - this.tStart
            const percentsPerMs = 100 / (this.tEnd - this.tStart)
            const percents = Math.min(percentsPerMs * tElapsed, 100)

            if (this.prevPercents !== percents) {
                this.prevPercents = percents
                this.setAttrib("value", percents)
                super.update()
            }
        }
    }

    static get observedAttributes() {
        return ["start", "end"]
    }
}

customElements.define("anim-progress-bar", AnimProgressBar)
