export function createProgressBar(): HTMLElement {
    const element = document.createElement("progress-bar")

    return element
}

export function updateProgessBar(progressBar: HTMLElement, value: number, valueMax: number) {
    progressBar.innerText = `${value}/${valueMax}`
}
