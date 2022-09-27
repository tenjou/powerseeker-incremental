import { HTMLComponent } from "./../dom"

const template = document.createElement("template")
template.innerHTML = html`<style>
        :host {
            position: relative;
            display: flex;
            width: 100%;
            height: 16px;
            background: black;
            border-radius: 3px;
        }

        .bar {
            position: absolute;
            width: 0%;
            height: 100%;
            left: 0;
            transition: width 0.2s;
            background: linear-gradient(#e0313d, #bb232d);
            border-radius: 2px;
            border-top: 1px solid #ffffff5c;
        }

        :host(.blue) .bar {
            background: linear-gradient(#369ce4, #2f87c5);
        }

        .shadow {
            width: 100%;
            opacity: 0.35;
        }

        .value {
            display: flex;
            align-items: center;
            justify-content: center;
            position: absolute;
            width: 100%;
            height: 100%;
            left: 0;
            color: #fff;
            text-shadow: 0 0 2px #000;
            font-size: 11px;
        }
    </style>

    <div class="bar shadow"></div>
    <div id="progress" class="bar"></div>
    <div id="value" class="value"></div>`

class ProgressBar extends HTMLComponent {
    constructor() {
        super(template)
    }

    attributeChangedCallback() {
        this.update()
    }

    update() {
        const value = Number(this.getAttribute("value"))
        const valueMax = Number(this.getAttribute("value-max"))

        let percents = ((100 / valueMax) * value) | 0
        if (percents > 100) {
            percents = 100
        } else if (percents < 0) {
            percents = 0
        }

        this.getElement("#value").innerText = `${value}`
        this.getElement("#progress").style.width = `${percents}%`
    }

    static get observedAttributes() {
        return ["value", "value-max"]
    }
}

customElements.define("progress-bar", ProgressBar)
