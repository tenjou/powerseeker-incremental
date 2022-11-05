export function getElement(id: string) {
    const element = document.getElementById(id)
    if (!element) {
        console.error(`Could get element with id: "${id}"`)
        return document.createElement("div")
    }

    return element
}

export function removeElement(id: string) {
    const element = document.getElementById(id)
    if (!element) {
        console.error(`Could get element: "${id}"`)
        return
    }

    element.remove()
}

export function removeAllChildren(id: string) {
    const element = document.getElementById(id)
    if (!element) {
        console.error(`Could get element: "${id}"`)
        return
    }

    while (element.firstChild) {
        element.removeChild(element.firstChild)
    }
}

export function addChild(id: string, child: HTMLElement) {
    const element = document.getElementById(id)
    if (!element) {
        console.error(`Could get element: "${id}"`)
        return
    }

    element.appendChild(child)
}

export function setText(id: string, text: string | number) {
    const element = document.getElementById(id)
    if (!element) {
        console.error(`Could set element: "${id}" text to: ${text}`)
        return
    }

    element.innerText = String(text)
}

export function setHTML(id: string, text: string) {
    const element = document.getElementById(id)
    if (!element) {
        console.error(`Could set element: "${id}" text to: ${text}`)
        return
    }

    element.innerHTML = text
}

export function setOnClick(id: string, func: () => void) {
    const element = document.getElementById(id)
    if (!element) {
        console.error(`Could set element: "${id}" onclick`)
        return
    }

    element.onclick = func
}

export function toggleClassName(id: string, className: string, add: boolean, parent: HTMLElement | null = null) {
    const element = parent && parent.shadowRoot ? parent.shadowRoot.querySelector(`#${id}`) : document.getElementById(id)
    if (!element) {
        return
    }

    if (add) {
        element.classList.add(className)
    } else {
        element.classList.remove(className)
    }
}

export function setShow(id: string, show: boolean) {
    const element = document.getElementById(id)
    if (!element) {
        console.error(`Could set element: "${id}" to set show: ${show}`)
        return
    }

    if (show) {
        element.classList.remove("hide")
    } else {
        element.classList.add("hide")
    }
}

export class HTMLComponent extends HTMLElement {
    constructor(template: HTMLTemplateElement) {
        super()

        const shadowRoot = this.attachShadow({ mode: "open" })
        shadowRoot.append(template.content.cloneNode(true))
    }

    getElement(query: string): HTMLElement {
        if (!this.shadowRoot) {
            console.error(`Missing shadowRoot`)
            return document.createElement("div")
        }

        if (!query) {
            return this
        }

        const element = this.shadowRoot.querySelector(query) as HTMLElement
        if (!element) {
            console.error(`Could not find child element with query: ${query}`)
            return document.createElement("div")
        }

        return element
    }

    setText(query: string, text: string | number | null) {
        this.getElement(query).innerText = String(text)
    }

    setHTML(query: string, text: string | number | null) {
        if (!text) {
            return
        }
        this.getElement(query).innerHTML = String(text)
    }

    setAttrib(key: string, value: string | number) {
        this.setAttribute(key, String(value))
    }

    toggleClassName(className: string, add: boolean, query: string = "") {
        if (add) {
            this.getElement(query).classList.add(className)
        } else {
            this.getElement(query).classList.remove(className)
        }
    }

    haveAttribute(key: string) {
        return this.getAttribute(key) !== null
    }
}
