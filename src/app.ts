import { addCard } from "./cards"
import { updateSkills } from "./skills"
import { updatePlayerStatus } from "./status"
import { setupDungeonSystem } from "./dungeon"
import { updateBattle } from "./battle"

let tLast = 0

function setup() {
    addCard("unknown_location")
    addCard("dungeon")
    addCard("encounter_boar")
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
    setup()
    update()
}
