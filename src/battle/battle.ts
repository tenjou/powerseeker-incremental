import { AbilityConfigs } from "../config/AbilityConfigs"
import { StartBattleAction } from "../config/CardConfigs"
import { addChild, removeAllChildren, setShow, setText, toggleClassName } from "../dom"
import { Ability, getState } from "../state"
import { updatePlayerStatus } from "../status"
import { Battler } from "../types"
import { randomItem } from "../utils"
import { BattleAction } from "./../state"
import { addBattler, createMonsterBattler, loadBattlers } from "./battler"
import { updateBattler } from "./components/battler-item"
import { updateBattleStatus } from "./components/battle-status"
import { loadAbilities } from "./components/battle-ability"
import { getActionSpeed } from "./battle-utils"
import { updateBattleAnimation } from "./battle-animation"

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

    loadBattlers()
    loadAbilities()
    updateBattleStatus()

    setShow("area-battle", true)
}

function endBattle() {
    const state = getState()

    state.battle = {
        battlersA: [],
        battlersB: [],
        actions: [],
        animations: [],
        animationsActive: [],
        cardId: -1,
        id: 0,
        tCurrent: 0,
        turn: 0,
    }

    setShow("area-battle", false)

    updatePlayerStatus()
    setShow("area-town", true)

    removeAllChildren("battle-column-a")
    removeAllChildren("battle-column-b")
    removeAllChildren("battle-abilities")
}

export function useAbility(ability: Ability) {
    const { battle, battler } = getState()

    battle.actions.push({
        battler,
        ability,
        speed: getActionSpeed(100),
    })

    updateAI()
    startExecutingTurn()
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
            speed: getActionSpeed(100),
        })
    }
}

function startExecutingTurn() {
    const { battle } = getState()

    battle.actions.sort((a, b) => b.speed - a.speed)

    handleNextAction()
}

function endTurn() {
    const { battle } = getState()

    battle.turn += 1

    updateBattleStatus()
}

function handleNextAction() {
    const { battle } = getState()

    if (battle.actions.length <= 0) {
        endTurn()
        return
    }

    let offset = 0

    for (const action of battle.actions) {
        const tStart = battle.tCurrent + offset

        battle.animations.push({
            type: "forward",
            battlerId: action.battler.id,
            tStart,
            tEnd: tStart + 1600,
        })

        battle.animations.push({
            type: "ability-use",
            battlerId: action.battler.id,
            tStart: tStart + 100,
            tEnd: tStart + 900,
            abilityId: action.ability.id,
        })

        battle.animations.push({
            type: "shake",
            battlerId: action.battler.id,
            tStart: tStart + 500,
            tEnd: tStart + 1600,
        })

        battle.animations.push({
            type: "scrolling-text",
            battlerId: action.battler.id,
            tStart: tStart + 500,
            tEnd: 0,
            value: -40,
            isCritical: true,
            isMiss: false,
        })

        offset += 1000
    }

    battle.animations.sort((a, b) => b.tStart - a.tStart)
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

    battle.tCurrent += tDelta

    updateBattleAnimation()

    // if (battle.animations.length > 0) {
    //     return
    // }
}
