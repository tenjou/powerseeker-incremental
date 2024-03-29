import { AspectService } from "./aspects/aspect-service"
import { updateBattle } from "./battle/battle-service"
import "./components/anim-progress-bar"
import "./components/area-transition"
import "./components/close-button"
import "./components/element-icon"
import "./components/progress-bar"
import "./components/scrolling-text"
import "./components/scrolling-status-text"
import "./components/sp-bar"
import "./components/view-header"
import "./components/view-header-sub"
import "./components/x-card"
import "./components/x-column"
import "./components/x-icon"
import "./components/x-row"
import "./components/x-text"
import "./components/x-timer"
import "./components/x-url"
import { XUrl } from "./components/x-url"
import { AreaConfigs, AreaId } from "./config/area-configs"
import "./currencies/currency-item"
import { getElement, removeAllChildren, setShow, setText } from "./dom"
import { emit, subscribe } from "./events"
import { i18n } from "./i18n"
import { InventoryService } from "./inventory/inventory-service"
import { LootService } from "./inventory/loot-service"
import { PlayerService } from "./player/player-service"
import { PopupService } from "./popup"
import { getState, loadState } from "./state"
import { loadTooltipSystem } from "./tooltip"
import { updateUrl } from "./url"
import { updateView } from "./view"
import { WorldService } from "./world/world-service"

let tLast = 0

function createEmptyProfile() {
    AspectService.create("novice")
    PlayerService.calculateStats()

    WorldService.addLocation("foo")
    WorldService.addLocation("bar")
    WorldService.addLocation("copper_mine")
    WorldService.addLocation("test_boss")

    // equipAbility("bash")
    // equipAbility("heal")
    // equipAbility("berserk")
    // equipAbility("poison")

    InventoryService.add(LootService.generateItem("leather_clothing", 1, 0))
    InventoryService.add(LootService.generateItem("leather_clothing", 1, 0))
    InventoryService.add(LootService.generateItem("leather_clothing", 1, 0))
    InventoryService.add(LootService.generateItem("axe", 1, 0))
    InventoryService.add(LootService.generateItem("sword", 1, 0))
    InventoryService.add(LootService.generateItem("shield", 1, 0))
    InventoryService.add(LootService.generateItem("shield", 1, 0))
}

function load() {
    window.addEventListener("keydown", (event: KeyboardEvent) => {
        if (event.key === "Escape") {
            emit("close", event)
        }
    })

    const state = getState()
    const isBattle = !!state.battle.id

    const copperOre = LootService.generateItem("copper_ore", 3, 0)
    InventoryService.add(copperOre)
    const healthPots = LootService.generateItem("health_potion", 2, 0)
    InventoryService.add(healthPots)

    WorldService.load()
    PopupService.load()

    loadNav()
    updateUrl()

    loadTooltipSystem()

    updateView(isBattle ? "battle" : undefined)

    subscribe("battle-start", onBattleStart)
    subscribe("battle-end", onBattleEnd)
}

const loadNav = () => {
    const generalNavItems: string[] = ["character", "inventory"]

    setText("world-nav-title", i18n("world"))
    setText("nav-title", i18n("menu"))

    const navItemsElement = getElement("#nav-items")

    for (const navId of generalNavItems) {
        const navItem = new XUrl()
        navItem.update(navId, `/${navId}`)
        navItemsElement.appendChild(navItem)
    }

    upadateWorldNav()
}

const upadateWorldNav = () => {
    const worldNavItemsElement = getElement("#world-nav-items")

    removeAllChildren(worldNavItemsElement)

    for (const key in AreaConfigs) {
        const areaId = key as AreaId
        const navItem = new XUrl()
        navItem.update(areaId, `/world/${areaId}`)
        worldNavItemsElement.appendChild(navItem)
    }
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

window.addEventListener("popstate", () => updateView())
window.addEventListener("pushstate", () => {
    updateUrl()
    updateView()
})
window.addEventListener("hashchange", () => updateView())

declare global {
    function html(str: TemplateStringsArray, ...values: unknown[]): string
}
