export interface ProgressBarComponent {
    element: HTMLElement
    bar: HTMLElement
    value: HTMLElement
}

export function createProgressBar(): ProgressBarComponent {
    const element = document.createElement("progress-bar")

    const shadow = document.createElement("bar")
    shadow.classList.add("shadow")
    element.appendChild(shadow)

    const bar = document.createElement("bar")
    element.appendChild(bar)

    const value = document.createElement("value")
    element.appendChild(value)

    return {
        element,
        bar,
        value,
    }
}

export function updateProgessBar(progressBar: ProgressBarComponent, value: number, valueMax: number) {
    let percents = ((100 / valueMax) * value) | 0
    if (percents > 100) {
        percents = 100
    } else if (percents < 0) {
        percents = 0
    }

    progressBar.bar.style.width = `${percents}%`
    progressBar.value.innerText = `${value}/${valueMax}`
}
