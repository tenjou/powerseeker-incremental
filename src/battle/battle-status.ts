import { setText } from "../dom"
import { getState } from "../state"

export function updateBattleStatus() {
    const { battle } = getState()

    setText("battle-name", "Dungeon Encounter")
    setText("battle-round", `Round ${battle.turn}`)
    setText("battle-level", "Level 1")
}
