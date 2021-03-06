import { AbilityConfigs } from "../config/ability-configs"
import { StartBattleAction } from "../config/CardConfigs"
import { removeAllChildren, setShow, setText } from "../dom"
import { Ability, getState } from "../state"
import { updatePlayerStatus } from "../status"
import { BattlerId } from "../types"
import { randomItem, roll } from "../utils"
import { shuffle } from "./../utils"
import { loadAbilities, renderAbilities } from "./battle-ability"
import { addAnimationsFromLog, updateBattleAnimation } from "./battle-animation"
import { Battle, BattleAction, BattleActionLog, BattleActionTarget, Battler } from "./battle-types"
import { calculatePower, getActionSpeed } from "./battle-utils"
import { addBattler, createMonsterBattler, loadBattlers } from "./battler"

const AttackAbility: Ability = {
    id: "attack",
    rank: 1,
}

export function startBattle(cardId: number, action: StartBattleAction) {
    createBattleInstance(cardId, action)
    loadBattle()
}

function createBattleInstance(cardId: number, action: StartBattleAction) {
    const state = getState()
    const { battler, cache } = state

    const battle = createBattle()
    battle.id = cache.lastBattleId++
    battle.cardId = cardId
    state.battle = battle

    nextTurn()

    addBattler(battler)
    battle.playerBattlerId = battler.id

    for (const monsterId of action.monsters) {
        const monsterBattler = createMonsterBattler(monsterId)
        addBattler(monsterBattler)
    }
}

export function loadBattle() {
    setShow("area-town", false)

    loadBattlers()
    loadAbilities()

    renderBattleStatus()

    setShow("area-battle", true)
}

function renderBattleStatus() {
    const { battle } = getState()

    setText("battle-name", "Dungeon Encounter")
    setText("battle-round", `Round ${battle.turn}`)
    setText("battle-level", "Level 1")

    if (!battle.selectedAbility && battle.status === "waiting") {
        setText("battle-hint", "Select your action")
    } else {
        setText("battle-hint", "")
    }
}

function endBattle() {
    const state = getState()

    state.battle = createBattle()

    setShow("area-battle", false)

    updatePlayerStatus()
    setShow("area-town", true)

    removeAllChildren("battle-column-a")
    removeAllChildren("battle-column-b")
    removeAllChildren("battle-abilities")
}

export function selectAbility(ability: Ability | null) {
    const { battle } = getState()

    battle.selectedAbility = ability

    renderBattleStatus()
    renderAbilities()
}

export function useSelectedAbility(targetId: BattlerId) {
    const { battle, battler } = getState()

    if (!battle.selectedAbility) {
        return
    }

    battle.actions.push({
        casterId: battler.id,
        targetId,
        ability: battle.selectedAbility,
        speed: getActionSpeed(100),
    })

    updateAI()
    startExecutingTurn()
}

function updateAI() {
    const { battle } = getState()

    for (const battlerId of battle.teamB) {
        const battler = battle.battlers[battlerId]
        if (!battler.isAI) {
            continue
        }

        const targetId = randomItem(battle.teamA)

        battle.actions.push({
            casterId: battler.id,
            targetId,
            ability: AttackAbility,
            speed: getActionSpeed(100),
        })
    }
}

function startExecutingTurn() {
    const { battle } = getState()

    battle.status = "executing"

    selectAbility(null)

    shuffle(battle.actions)
    battle.actions.sort((a, b) => b.speed - a.speed)

    nextAction()
}

function isTeamDead(battlerIds: BattlerId[]) {
    const { battle } = getState()

    for (const battlerId of battlerIds) {
        const battler = battle.battlers[battlerId]
        if (battler.hp > 0) {
            return false
        }
    }

    return true
}

function nextTurn() {
    const { battle } = getState()

    battle.status = "waiting"
    battle.turn += 1
    battle.actions.length = 0
    battle.log.push([])

    renderBattleStatus()
}

function nextAction() {
    const { battle } = getState()

    let action: BattleAction | undefined
    let caster: Battler | null = null
    while (battle.actions.length > 0) {
        action = battle.actions.pop()
        if (!action) {
            continue
        }

        caster = battle.battlers[action.casterId]
        if (caster && caster.hp <= 0) {
            break
        }
    }

    if (!action) {
        nextTurn()
        return
    }

    if (!caster) {
        console.error(`Could not find caster BattlerId. {casterId: ${action.casterId}}`)
        return
    }

    const abilityConfig = AbilityConfigs[action.ability.id]

    const targets = targetOpponent(caster, action.targetId)

    let targetHasDied = false
    const actionTargets: BattleActionTarget[] = new Array(targets.length)

    for (let n = 0; n < targets.length; n += 1) {
        const target = targets[n]

        for (const effect of abilityConfig.effects) {
            let power = 0
            let isCritical = false
            let isMiss = false

            switch (effect.type) {
                case "hp-minus": {
                    const hitChance = 100 + caster.stats.accuracy - target.stats.evasion
                    if (!roll(hitChance)) {
                        isMiss = true
                        power = -1
                        break
                    }

                    power = calculatePower(caster.stats, effect) * -1

                    const criticalChance = caster.stats.critical - target.stats.critical
                    if (roll(criticalChance)) {
                        isCritical = true
                        power *= 1.25 | 0
                    }

                    target.hp += power
                    if (target.hp <= 0) {
                        target.hp = 0
                        targetHasDied = true
                        removeBattlerFromTeam(target)
                    }
                    break
                }

                case "hp-plus": {
                    power = calculatePower(caster.stats, effect)

                    const criticalChance = 100 + caster.stats.critical
                    if (roll(criticalChance)) {
                        isCritical = true
                        power *= 1.25 | 0
                    }

                    target.hp += power
                    if (target.hp > target.hpMax) {
                        target.hp = target.hpMax
                    }
                    break
                }
            }

            actionTargets[n] = {
                battlerId: target.id,
                isCritical,
                isMiss,
                power,
            }
        }
    }

    const logEntry: BattleActionLog = {
        abilityId: action.ability.id,
        casterId: action.casterId,
        targets: actionTargets,
    }
    const turnLog = battle.log[battle.turn - 1]
    turnLog.push(logEntry)

    addAnimationsFromLog(logEntry)

    battle.tNextAction = battle.tCurrent + 2000
}

function targetOpponent(caster: Battler, targetId: BattlerId) {
    const { battle } = getState()

    const targetBattler = battle.battlers[targetId]
    if (targetBattler && targetBattler.hp > 0) {
        return [targetBattler]
    }

    const targetTeam = caster.isTeamA ? battle.teamB : battle.teamA
    for (const battlerId of targetTeam) {
        const battler = battle.battlers[battlerId]
        if (battler && battler.hp > 0) {
            return [battler]
        }
    }

    return []
}

function removeBattlerFromTeam(battlerToRemove: Battler) {
    const { battle } = getState()

    const team = battlerToRemove.isTeamA ? battle.teamA : battle.teamB
    const index = team.findIndex((battlerId) => battlerId === battlerToRemove.id)
    if (index === -1) {
        console.error(`Could not remove battler from the team: ${battlerToRemove}`)
        return
    }

    team.splice(index, 1)
}

export function updateBattle(tDelta: number) {
    const { battle } = getState()

    if (battle.id === -1) {
        return
    }

    battle.tCurrent += tDelta

    updateBattleAnimation(tDelta)

    if (battle.status === "executing" && battle.tNextAction <= battle.tCurrent) {
        nextAction()
    }
}

function createBattle(): Battle {
    return {
        status: "preparing",
        battlers: [],
        battlersView: [],
        teamA: [],
        teamB: [],
        actions: [],
        cardId: -1,
        id: 0,
        turn: 0,
        selectedAbility: null,
        selectedBattlerId: -1,
        isTeamA: true,
        playerBattlerId: -1,
        log: [],
        tCurrent: 0,
        tNextAction: 0,
    }
}
