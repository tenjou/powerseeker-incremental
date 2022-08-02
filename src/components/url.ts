import { HTMLComponent } from "../dom"

const template = document.createElement("template")
template.innerHTML = html`<style>
        :host {
            padding: 5px 10px;
            cursor: pointer;
            color: #444;
            font-weight: 600;
            border-left: 2px solid #0000;
        }
        :host(:hover) {
            color: #000;
            background: #ffffff47;
            border-left: 2px solid black;
        }
    </style>

    <slot></slot>`

customElements.define("x-url", class extends HTMLComponent {
    constructor() {
        super(template)

        this.onclick = () => {
            history.pushState({}, "", this.innerText.toLocaleLowerCase())
            window.dispatchEvent(new Event("onpushstate"))
        }

    }
})
