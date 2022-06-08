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

interface NodeProps {
    id?: string
    onclick?: () => void
}

interface Node {
    tagName: string
    nodes: (Node | string)[]
    props?: NodeProps
}

export function renderParentId(parentId: string, nodes: (Node | string)[]) {
    const parent = document.getElementById(parentId)
    if (!parent) {
        console.error(`Could not find parent element with Id: ${parentId}`)
        return
    }

    renderParent(parent, nodes)
}

export function renderParent(parent: HTMLElement, nodes: (Node | string)[]) {
    const children = parent.childNodes
    const numChecks = Math.min(children.length, nodes.length)

    for (let n = 0; n < numChecks; n++) {
        const child = children[n] as HTMLElement
        const node = nodes[n]
        if (typeof node === "string") {
            if (child.nodeType === 3) {
                child.nodeValue = node
            } else {
                const textElement = document.createTextNode(node)
                parent.replaceChild(textElement, child)
            }
        } else {
            if (child.nodeType === 3 || child.localName !== node.tagName) {
                const element = document.createElement(node.tagName)
                renderParent(element, node.nodes)
                parent.replaceChild(element, child)

                if (node.props) {
                    applyProps(element, node.props)
                }
            } else {
                renderParent(child, node.nodes)

                if (node.props) {
                    applyProps(child, node.props)
                }
            }
        }
    }

    for (let n = numChecks; n < nodes.length; n++) {
        const node = nodes[n]
        if (typeof node === "string") {
            const textElement = document.createTextNode(node)
            parent.appendChild(textElement)
        } else {
            const element = document.createElement(node.tagName)
            renderParent(element, node.nodes)
            parent.appendChild(element)

            if (node.props) {
                applyProps(element, node.props)
            }
        }
    }

    if (children.length > nodes.length) {
        for (let n = children.length - 1; n >= numChecks; n--) {
            const child = children[n]
            child.remove()
        }
    }
}

function applyProps(element: HTMLElement, props: NodeProps) {
    if (props.id) {
        element.id = props.id
    }
    if (props.onclick) {
        element.onclick = props.onclick
    }
}

export function render(tagName: string, nodes: Node | string | (Node | string)[], props?: NodeProps): Node {
    return {
        tagName,
        nodes: !Array.isArray(nodes) ? [nodes] : nodes,
        props,
    }
}
