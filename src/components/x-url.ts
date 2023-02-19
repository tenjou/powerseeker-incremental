import { HTMLComponent } from "../dom"
import { goTo } from "../view"
import { i18n } from "./../i18n"

const template = document.createElement("template")
template.className = "pt-1 pb-1 pl-2 pr-2 m-px border-radius-3 hover:bg-white active:bg-white cursor-pointer"

export class XUrl extends HTMLComponent {
    href: string

    constructor() {
        super(template)

        this.onclick = () => {
            goTo(this.href)
        }
    }

    update(title: string, href: string) {
        this.id = `nav-item-${title}`
        this.innerHTML = i18n(title)
        this.href = href
    }
}

customElements.define("x-url", XUrl)
