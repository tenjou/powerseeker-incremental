import { HTMLComponent } from "../dom"

export class XTimer extends HTMLComponent {
    tEnd: number = 0
    onEnd: () => void
    timer: NodeJS.Timeout | null = null

    disconnectedCallback() {
        if (this.timer) {
            clearInterval(this.timer)
            this.timer = null
        }
    }

    update(tEnd: number, onEnd: () => void) {
        this.tEnd = tEnd
        this.onEnd = onEnd

        if (!this.timer) {
            this.timer = setInterval(() => this.updateFromTimer(), 200)
        }

        this.updateFromTimer()
    }

    updateFromTimer() {
        const tNow = Date.now()
        const tDiff = this.tEnd - tNow
        const tDiffSec = Math.floor(tDiff / 1000)
        const tDiffMs = tDiff % 1000
        const tDiffMsStr = tDiffMs.toString().padStart(3, "0")

        console.log("updateFromTimer", tDiffSec, tDiffMs, `${tDiffSec}.${tDiffMsStr}`)
        this.innerHTML = `${tDiffSec}.${tDiffMsStr}`

        if (tDiff <= 0 && this.onEnd) {
            if (this.timer) {
                clearInterval(this.timer)
                this.timer = null
            }
            this.onEnd()
        }
    }
}

customElements.define("x-timer", XTimer)
