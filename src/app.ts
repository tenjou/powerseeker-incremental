import { addCard, loadCards } from "./cards"
import { updateSkills } from "./skills"
import { updatePlayerStatus } from "./status"
import { loadDungeonStage, setupDungeonSystem } from "./dungeon"
import { updateBattle } from "./battle"
import { getState, loadState } from "./state"
import { setShow } from "./dom"

let tLast = 0

function createEmptyProfile() {
    addCard("unknown_location")
    addCard("dungeon")
    addCard("encounter_boar")
}

function load() {
    const state = getState()

    if (state.battle.id) {
        console.log("battle")
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
    updatePlayerStatus()
    updateSkills()
    setupDungeonSystem()

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
    } else {
        createEmptyProfile()
    }

    update()
    load()
}

window.onbeforeunload = () => {
    const state = getState()

    localStorage.setItem("profile", JSON.stringify(state))
}
