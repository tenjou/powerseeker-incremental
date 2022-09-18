import { getElement, removeAllChildren } from "./../dom"
import { startBattle } from "./../battle/battle"

export function loadWorldView() {
    const worldParent = getElement("world")

    const forestBattle = document.createElement("x-button")
    forestBattle.setAttribute("class", "black")
    forestBattle.innerHTML = "Forest Battle"
    forestBattle.onclick = () => startBattle("test_battle")
    worldParent.appendChild(forestBattle)
}

export function unloadWorldView() {
    removeAllChildren("world")
}
