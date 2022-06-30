import { HTMLComponent } from "../dom"

export class ScrollingText extends HTMLComponent {
    constructor() {
        super(template)

        this.style.color = this.getAttribute("color") || "#f44336"

        setTimeout(() => {
            this.remove()
        }, 1100)
    }
}

customElements.define("scrolling-text", ScrollingText)

const template = document.createElement("template")
template.innerHTML = html`<style>
        :host {
            position: absolute;
            left: 50%;
            top: -15px;
            z-index: 999;
            padding: 4px;
            display: flex;
            justify-content: center;
            align-items: center;
            background: rgba(0, 0, 0, 0.05);
            border-radius: 3px;
            z-index: 999;
            font-size: 19px;
            font-family: fantasy;
            text-shadow: 1px 1px 0px #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;

            animation-name: scrolling-text;
            animation-duration: 1.1s;
            animation-iteration-count: 1;
            animation-fill-mode: forwards;
        }

        @keyframes scrolling-text {
            0% {
                opacity: 1;
                transform: translate(-50%, 0px) scale(2, 2);
            }
            15% {
                opacity: 1;
                transform: translate(-50%, 0px) scale(1, 1);
            }
            80% {
                opacity: 1;
                transform: translate(-50%, -50px);
            }
            100% {
                opacity: 0;
                transform: translate(-50%, -50px);
            }
        }
    </style>

    <slot></slot>`
