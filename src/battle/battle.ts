import { AbilityConfigs } from "../config/AbilityConfigs"
import { StartBattleAction } from "../config/CardConfigs"
import { addChild, removeAllChildren, setShow, setText } from "../dom"
import { Ability, getState } from "../state"
import { updatePlayerStatus } from "../status"
import { Battler } from "../types"
import { randomItem } from "../utils"
import { BattleAction } from "./../state"
import { addBattler, createMonsterBattler, loadBattlers } from "./battler"
import { updateBattler } from "./components/battler-item"

const AttackAbility: Ability = {
    id: "attack",
    rank: 1,
}

export function startBattle(cardId: number, action: StartBattleAction) {
    createBattle(cardId, action)
    loadBattle()
}

function createBattle(cardId: number, action: StartBattleAction) {
    const { battle, battler, cache } = getState()

    battle.id = cache.lastBattleId++
    battle.cardId = cardId
    battle.turn = 1

    addBattler(battler)

    for (const monsterId of action.monsters) {
        const monsterBattler = createMonsterBattler(monsterId)
        addBattler(monsterBattler)
    }
}

export function loadBattle() {
    setShow("area-town", false)

    renderBattle()

    loadBattlers()
    loadAbilities()

    setShow("area-battle", true)
}

function endBattle() {
    const state = getState()

    state.battle = {
        battlersA: [],
        battlersB: [],
        actions: [],
        cardId: -1,
        id: 0,
        tBattle: 0,
        turn: 0,
    }

    setShow("area-battle", false)

    updatePlayerStatus()
    setShow("area-town", true)

    removeAllChildren("battle-column-a")
    removeAllChildren("battle-column-b")
    removeAllChildren("battle-abilities")
}

function renderBattle() {
    const { battle } = getState()

    setText("battle-turn", `Turn: ${battle.turn}`)
}

function loadAbility(ability: Ability) {
    const abilityConfig = AbilityConfigs[ability.id]

    const abilityElement = document.createElement("battle-ability")
    abilityElement.innerText = abilityConfig.name
    abilityElement.onclick = () => {
        handleAbilityUse(ability)
    }

    addChild("battle-abilities", abilityElement)
}

function loadAbilities() {
    const { abilities } = getState()

    for (const ability of abilities) {
        loadAbility(ability)
    }
}

function handleAbilityUse(ability: Ability) {
    const { battle, battler } = getState()

    battle.actions.push({
        battler,
        ability,
    })

    updateAI()
    executeTurn()
}

function updateAI() {
    const { battle } = getState()

    for (const battler of battle.battlersB) {
        if (!battler.isAI) {
            continue
        }

        battle.actions.push({
            battler,
            ability: AttackAbility,
        })
    }
}

function executeTurn() {
    const { battle } = getState()

    for (const action of battle.actions) {
        if (handleAction(action)) {
            endBattle()
            break
        }
    }

    battle.turn += 1

    renderBattle()
}

function handleAction(action: BattleAction) {
    const { battle } = getState()

    const enemyBattlers = action.battler.isTeamA ? battle.battlersB : battle.battlersA
    const target = randomItem(enemyBattlers)

    target.hp -= action.battler.power - target.defense
    if (target.hp <= 0) {
        target.hp = 0

        if (isTeamDead(enemyBattlers)) {
            return true
        }
    }

    updateBattler(target)

    return false
}

function isTeamDead(battlers: Battler[]) {
    for (const battler of battlers) {
        if (battler.hp > 0) {
            return false
        }
    }

    return true
}

export function updateBattle(tDelta: number) {
    const { battle } = getState()

    if (battle.id === -1) {
        return
    }

    battle.tBattle += tDelta
}
