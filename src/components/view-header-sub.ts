import { HTMLComponent } from "../dom"
import { i18n } from "../i18n"

const template = document.createElement("template")
template.className = "block pb-1 mb-3 border-bottom font-3 color-dark bold"
template.innerHTML = html`
    <span id="category"></span>
    <i class="fa-solid fa-angle-right ml-1 mr-1 font-2"></i>
    <span id="subcategory"></span>
`

export class ViewHeaderSub extends HTMLComponent {
    constructor() {
        super(template)
    }

    connectedCallback() {
        super.connectedCallback()

        const category = this.getAttribute("category")
        const subcategory = this.getAttribute("subcategory")

        this.update({ category, subcategory })
    }

    update({ category, subcategory }: { category: string; subcategory?: string }) {
        this.setText("#category", i18n(category) || "<None>")
        this.setText("#subcategory", i18n(subcategory) || "<None>")
    }
}

customElements.define("view-header-sub", ViewHeaderSub)
