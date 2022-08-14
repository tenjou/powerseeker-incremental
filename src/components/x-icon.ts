import { HTMLComponent } from "../dom"

const template = document.createElement("template")
template.innerHTML = html`<link rel="stylesheet" href="/ext/font-awesome/all.min.css" />
    <style>
        :host {
            display: flex;
            align-items: center;
            margin: 0 6px;
            min-height: 10px;
            font-size: 10px;
            color: #a9a9a9;
        }
    </style>

    <i class="fa-solid"></i>`

class XIcon extends HTMLComponent {
    constructor() {
        super(template)

        const i = this.getElement("i")
        i.classList.add(this.getAttribute("icon") || "fa-angle-right")
    }
}

customElements.define("x-icon", XIcon)
