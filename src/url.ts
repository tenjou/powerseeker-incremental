let selectedUrl: string = ""
let selectedSegments: string[] = []

export const updateUrl = () => {
    const segments = window.location.pathname.slice(1).split("/")
    const currUrl = segments[segments.length - 1]

    if (selectedUrl) {
        const element = document.getElementById(selectedUrl)
        if (element) {
            element.removeAttribute("data-active")
        }
    }

    selectedUrl = `nav-item-${currUrl}`
    selectedSegments = segments

    const element = document.getElementById(selectedUrl)
    if (element) {
        element.setAttribute("data-active", "")
    }
}

export const getUrlSegments = () => {
    return selectedSegments
}
