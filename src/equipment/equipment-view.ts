import { goTo } from "../view"
import { getElement } from "./../dom"
import { getState } from "./../state"

export function loadEquipmentView(segments: string[]) {
    const { equipment } = getState()

    console.log(segments)

    getElement("close-equipment").onclick = () => {
        goTo("/character")
    }
}

export function unloadEquipmentView() {}
