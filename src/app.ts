import { BattleService, updateBattle } from "./battle/battle-service"
import { recalculateStats } from "./character/status"
import "./components/anim-progress-bar"
import "./components/area-transition"
import "./components/close-button"
import "./components/progress-bar"
import "./components/scrolling-text"
import "./components/stats-table"
import "./components/url"
import "./components/x-card"
import "./components/x-column"
import "./components/x-header"
import "./components/x-icon"
import "./components/x-row"
import "./components/x-text"
import "./currencies/currency-item"
import { setShow } from "./dom"
import { emit, subscribe } from "./events"
import { ExplorationService } from "./exploration/exploration-service"
import { equipAbility } from "./loadout/loadout"
import { loadPopupSystem } from "./popup"
import { getState, loadState } from "./state"
import { loadTooltipSystem } from "./tooltip"
import { updateView } from "./view"
import { WorldService } from "./world/world-service"

let tLast = 0

function createEmptyProfile() {
    // addCard("unknown_location")
    // addCard("dungeon")
    // addCard("encounter_boar")

    // addItem("leather_clothing", {
    //     power: 2,
    //     rarity: 2,
    //     amount: 1,
    // })
    // addItem("leather_clothing", {
    //     power: 3,
    //     rarity: 1,
    //     amount: 2,
    // })
    // addItem("axe", {
    //     power: 3,
    //     rarity: 1,
    //     amount: 1,
    // })
    // addItem("sword", {
    //     power: 2,
    //     rarity: 2,
    //     amount: 1,
    // })
    // addItem("leather_clothing", {
    //     power: 1,
    //     rarity: 4,
    //     amount: 2,
    // })
    // addItem("health_potion", {
    //     power: 3,
    //     rarity: 4,
    //     amount: 5,
    // })

    ExplorationService.addArea("forest")

    WorldService.addLocation("foo")
    WorldService.addLocation("bar")

    equipAbility("attack")
    equipAbility("bash")
    equipAbility("heal")
    equipAbility("berserk")
    equipAbility("poison")
}

function load() {
    window.addEventListener("keydown", (event: KeyboardEvent) => {
        if (event.key === "Escape") {
            emit("close", event)
        }
    })

    const state = getState()
    const isBattle = !!state.battle.id

    recalculateStats()
    loadTooltipSystem()
    loadPopupSystem()

    updateView(isBattle ? "battle" : undefined)

    subscribe("battle-start", onBattleStart)
    subscribe("battle-end", onBattleEnd)
}

function loadSave() {
    const state = getState()

    if (state.battle.id) {
        console.log("battle")
    } else {
        setShow("area-town", true)
    }
}

const onBattleStart = () => {
    updateView("battle")
}

const onBattleEnd = () => {
    updateView()
}

function update() {
    tLast = Date.now()

    setInterval(() => {
        const tCurrent = Date.now()
        const tDelta = tCurrent - tLast

        WorldService.update(tCurrent)
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

window.addEventListener("popstate", () => updateView)
window.addEventListener("pushstate", () => updateView)
window.addEventListener("hashchange", () => updateView)

declare global {
    function html(str: TemplateStringsArray, ...values: unknown[]): string
}
