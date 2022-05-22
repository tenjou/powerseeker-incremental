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

export function setText(id: string, text: string) {
    const element = document.getElementById(id)
    if (!element) {
        console.error(`Could set element: "${id}" text to: ${text}`)
        return
    }

    element.innerText = text
}

export function setOnClick(id: string, func: () => void) {
    const element = document.getElementById(id)
    if (!element) {
        console.error(`Could set element: "${id}" onclick`)
        return
    }

    element.onclick = func
}

export function toggleClassName(id: string, className: string, add: boolean) {
    const element = document.getElementById(id)
    if (!element) {
        console.error(`Could set element: "${id}" class to: ${className}`)
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
