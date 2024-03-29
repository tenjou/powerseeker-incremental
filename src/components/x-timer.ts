import { HTMLComponent } from "../dom"

export class XTimer extends HTMLComponent {
    tEnd: number = 0
    timer: NodeJS.Timeout | null = null

    disconnectedCallback() {
        if (this.timer) {
            clearInterval(this.timer)
            this.timer = null
        }
    }

    update(tEnd: number) {
        this.tEnd = tEnd

        if (!this.timer) {
            this.timer = setInterval(() => this.updateFromTimer(), 200)
        }

        this.updateFromTimer()
    }

    updateFromTimer() {
        const tNow = Date.now()
        const tDiff = this.tEnd - tNow
        const tDiffSec = Math.ceil(tDiff / 1000)
        const tDiffMin = Math.floor(tDiffSec / 60)

        const sec = (tDiffSec % 60).toString().padStart(2, "0")
        const min = (tDiffMin % 60).toString().padStart(2, "0")
        const hours = Math.floor(tDiffMin / 60)
            .toString()
            .padStart(2, "0")

        this.innerHTML = `${hours}:${min}:${sec}`

        if (tDiff <= 0) {
            if (this.timer) {
                clearInterval(this.timer)
                this.timer = null
            }
        }
    }
}

customElements.define("x-timer", XTimer)
