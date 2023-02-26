import { removeAllChildren, setOnClick, setText } from "../../dom"
import { getState } from "../../state"
import { loadAbilities, renderSkills } from "./battle-skill"
import { loadBattler } from "./battler-item"
import { subscribe, unsubscribe } from "./../../events"
import { updateView } from "./../../view"

export const loadBattleView = () => {
    updateBattleAuto()
    loadBattlers()
    loadAbilities()
    updateStatus()

    setOnClick("battle-auto", toggleBattleAuto)

    subscribe("battle-start", showBattle)
    subscribe("battle-next-turn", updateNextTurn)
    subscribe("ability-selected", updateAbilityHint)
}

export const unloadBattleView = () => {
    removeAllChildren("battle-column-a")
    removeAllChildren("battle-column-b")
    removeAllChildren("battle-abilities")
}

const showBattle = () => {
    updateView("battle")
}

const loadBattlers = () => {
    const { battle } = getState()

    for (const battler of battle.battlers) {
        loadBattler(battler)
    }
}

const updateStatus = () => {
    const { battle } = getState()

    setText("battle-name", "Dungeon Encounter")
    setText("battle-round", `Turn  ${battle.turn}`)
    setText("battle-level", "Level 1")
}

const updateBattleAuto = () => {
    const { battle } = getState()

    setText("battle-auto", battle.isAuto ? "Auto" : "Manual")
}

const updateAbilityHint = () => {
    const { battle } = getState()

    if (!battle.selectedSkill && battle.status === "waiting") {
        setText("battle-hint", "Select your action")
    } else {
        setText("battle-hint", "")
    }

    renderSkills()
}

const updateNextTurn = () => {
    renderSkills()
    updateStatus()
}

const toggleBattleAuto = () => {
    const { battle } = getState()

    battle.isAuto = !battle.isAuto

    updateBattleAuto()
}
