import { goTo } from "../view"
import { getElement } from "./../dom"

export function loadEquipmentView() {
    getElement("close-equipment").onclick = () => {
        goTo("/character")
    }
}

export function unloadEquipmentView() {}
