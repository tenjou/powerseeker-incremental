import { addCard } from "./cards"
import { updateSkills } from "./skills"
import { updateStatus } from "./status"
import { setupDungeonSystem } from "./dungeon"

function setup() {
    addCard("unknown_location")
    addCard("dungeon")
}

function update() {
    updateStatus()
    updateSkills()
    setupDungeonSystem()
}

document.body.onload = () => {
    setup()
    update()
}
