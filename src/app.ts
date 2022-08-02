import { loadBattle, updateBattle } from "./battle/battle"
import { addCard, loadCards } from "./cards"
import "./components/area-transition"
import "./components/button"
import "./components/close-button"
import "./components/column"
import "./components/header"
import "./components/item-slot"
import "./components/popup-container"
import "./components/progress-bar"
import "./components/row"
import "./components/scrolling-text"
import "./components/text"
import "./components/url"
import { setShow } from "./dom"
import { loadDungeonStage, setupDungeonSystem } from "./dungeon"
import { loadEquipmentWidget } from "./equipment"
import { addItem } from "./inventory/inventory"
import { updateSkills } from "./skills"
import { getState, loadState } from "./state"
import { updateView } from "./view"

let tLast = 0

function createEmptyProfile() {
    addCard("unknown_location")
    addCard("dungeon")
    addCard("encounter_boar")

    addItem("leather_clothing", 2)
    addItem("health_potion", 5)
}

function load() {
    updateView()

    const state = getState()

    if (state.battle.id) {
        loadBattle()
    } else if (state.dungeon.id) {
        loadDungeonStage()
    } else {
        setShow("area-town", true)
    }
}

function loadSave() {
    const state = getState()

    loadCards(state.town.cards, false)

    if (state.battle.id) {
        console.log("battle")
    } else if (state.dungeon.id) {
        loadDungeonStage()
    } else {
        setShow("area-town", true)
    }
}

function update() {
    updateSkills()
    setupDungeonSystem()

    loadEquipmentWidget()

    tLast = Date.now()

    setInterval(() => {
        const tCurrent = Date.now()
        const tDelta = tCurrent - tLast

        updateBattle(tDelta)

        tLast = tCurrent
    }, 1000 / 60)
}

document.body.onload = () => {
    const json = localStorage.getItem("profile")
    if (json) {
        const state = JSON.parse(json)
        console.log(state)
        loadState(state)
        loadSave()
        update()
    } else {
        update()
        createEmptyProfile()
    }

    load()
}

window.onbeforeunload = () => {
    const state = getState()

    // localStorage.setItem("profile", JSON.stringify(state))
}

window.addEventListener("onpopstate", updateView)
window.addEventListener("onpushstate", updateView)

declare global {
    function html(str: TemplateStringsArray): string
}
