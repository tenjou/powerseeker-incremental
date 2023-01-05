export function getElementById(id: string) {
    const element = document.getElementById(id)
    if (!element) {
        console.error(`Could get element with id: "${id}"`)
        return document.createElement("div")
    }

    return element
}

export function getElement<T extends HTMLElement>(query: string) {
    const element = document.querySelector(query)
    if (!element) {
        console.error(`Could get element: "${query}"`)
        return document.createElement("div") as unknown as T
    }

    return element as T
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
    const element = parent ? parent.querySelector(`#${id}`) : document.getElementById(id)
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
    rootClasses: string

    constructor(template: HTMLTemplateElement) {
        super()

        const root = template.content.cloneNode(true) as HTMLElement
        this.rootClasses = template.getAttribute("class") || ""
        this.append(root)
    }

    connectedCallback() {
        if (this.rootClasses) {
            const outerClasses = this.getAttribute("class")
            this.setAttribute("class", outerClasses + " " + this.rootClasses)
        }
    }

    attributeChangedCallback() {
        if (this.children.length === 0) {
            return
        }
    }

    update(props?: unknown) {}

    getElement<T extends HTMLComponent>(query: string, clear = false): T {
        if (!query) {
            return this as unknown as T
        }

        const element = this.querySelector(query) as unknown as T
        if (!element) {
            console.error(`Could not find child element with query: ${query}`)
            return document.createElement("div") as unknown as T
        }

        if (clear) {
            while (element.firstChild) {
                element.removeChild(element.firstChild)
            }
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

    getAttrib(key: string) {
        return this.getAttribute(key)
    }

    toggleClassName(className: string, add: boolean, query: string = "") {
        if (add) {
            this.getElement(query).classList.add(className)
        } else {
            this.getElement(query).classList.remove(className)
        }
    }

    toggleAttr(attr: string, add: boolean, query: string = "") {
        if (add) {
            this.getElement(query).setAttribute(attr, "")
        } else {
            this.getElement(query).removeAttribute(attr)
        }
    }

    haveAttribute(key: string) {
        return this.getAttribute(key) !== null
    }
}
