import { AbilityConfig, AbilityConfigs } from "../config/ability-configs"
import { EncounterConfigs, EncounterId } from "../config/encounter-configs"
import { MonsterConfigs } from "../config/monster-configs"
import { removeAllChildren, setOnClick, setShow, setText } from "../dom"
import { PlayerService } from "../player/player-service"
import { Ability, getState } from "../state"
import { BattlerId } from "../types"
import { randomItem, randomNumber, roll } from "../utils"
import { openPopup } from "./../popup"
import { shuffle } from "./../utils"
import { Battle, BattleAction, BattleActionLog, BattleActionTarget, BattleLootItem, Battler, BattleResult } from "./battle-types"
import { calculatePower, getActionSpeed } from "./battle-utils"
import { addBattler, createMonsterBattler, loadBattlers } from "./battler"
import { loadAbilities, renderAbilities } from "./ui/battle-ability"
import { addAnimationsFromLog, updateBattleAnimation } from "./ui/battle-animation"
import "./ui/battle-result-popup"
import { addItem } from "./../inventory/inventory"
import { addCurrency } from "./../currencies/currencies"

const AttackAbility: Ability = {
    id: "attack",
    rank: 1,
}

export function startBattle(encounterId: EncounterId) {
    createBattleInstance(encounterId)
    loadBattle()
}

function createBattleInstance(encounterId: EncounterId) {
    const state = getState()
    const { battler, cache } = state

    const encounter = EncounterConfigs[encounterId]

    const battle = createBattle()
    battle.id = cache.lastBattleId++
    battle.encounterId = encounterId
    state.battle = battle

    nextTurn()
    addBattler(battler)

    battle.playerBattlerId = battler.id

    for (const monsterId of encounter.monsters) {
        const monsterBattler = createMonsterBattler(monsterId)
        addBattler(monsterBattler)
    }
}

export function loadBattle() {
    setShow("battle-container", true)

    updateBattleAuto()
    setOnClick("battle-auto", toggleBattleAuto)

    loadBattlers()
    loadAbilities()

    renderBattleStatus()

    setShow("main-container", false)
}

export function unloadBattle() {
    const state = getState()

    rewardPlayer()

    state.battle = createBattle()
    state.battleResult = null

    removeAllChildren("battle-column-a")
    removeAllChildren("battle-column-b")
    removeAllChildren("battle-abilities")

    setShow("main-container", true)
    setShow("battle-container", false)
}

function endBattle() {
    const state = getState()

    state.battle.status = "ended"
    state.battleResult = generateBattleResult()

    openPopup("battle-result-popup", {}, () => {
        unloadBattle()
    })
}

function generateBattleResult(): BattleResult {
    const { battle } = getState()

    const isVictory = isTeamDead(battle.isTeamA ? battle.teamB : battle.teamA)
    if (!isVictory) {
        return {
            isVictory,
            exp: 0,
            gold: 0,
            loot: [],
        }
    }

    let exp = 0
    let gold = 0
    const loot: BattleLootItem[] = []
    const opponentIsTeamA = !battle.isTeamA

    for (const battler of battle.battlers) {
        if (!battler.monsterId || battler.isTeamA !== opponentIsTeamA) {
            continue
        }

        const monsterConfig = MonsterConfigs[battler.monsterId]
        exp += monsterConfig.xp
        gold += monsterConfig.gold

        for (const monsterDrop of monsterConfig.loot) {
            if (roll(monsterDrop.chance)) {
                loot.push({
                    id: monsterDrop.id,
                    amount: randomNumber(monsterDrop.amountMin, monsterDrop.amountMax),
                    power: randomNumber(1, 100),
                    rarity: randomNumber(0, 4),
                })
            }
        }
    }

    return {
        isVictory,
        exp,
        gold,
        loot,
    }
}

function rewardPlayer() {
    const { battleResult } = getState()

    if (!battleResult || !battleResult.isVictory) {
        return
    }

    PlayerService.addExp(battleResult.exp)
    addCurrency("gold", battleResult.gold)

    for (const itemReward of battleResult.loot) {
        addItem(itemReward.id, {
            amount: itemReward.amount,
            power: itemReward.power,
            rarity: itemReward.rarity,
        })
    }
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
        speed: getActionSpeed(battler.stats.speed),
    })

    updateAI()
    startExecutingTurn()
}

function executeAutoBattle() {
    const { abilities, battle } = getState()

    const firstAbility = abilities.attack
    const team = battle.isTeamA ? battle.teamB : battle.teamA
    const targetId = randomItem(team)

    selectAbility(firstAbility)
    useSelectedAbility(targetId)
}

function updateAI() {
    const { battle } = getState()

    for (const battlerId of battle.teamB) {
        const battler = battle.battlers[battlerId]
        if (!battler.monsterId) {
            continue
        }

        const targetId = randomItem(battle.teamA)

        battle.actions.push({
            casterId: battler.id,
            targetId,
            ability: AttackAbility,
            speed: getActionSpeed(battler.stats.speed),
        })
    }
}

function startExecutingTurn() {
    const { battle } = getState()

    battle.status = "executing"

    selectAbility(null)

    shuffle(battle.actions)
    battle.actions.sort((a, b) => a.speed - b.speed)

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

    if (battle.isEnding) {
        endBattle()
        return
    }

    battle.status = "waiting"
    battle.turn += 1
    battle.actions.length = 0
    battle.log.push([])

    renderBattleStatus()
}

function nextAction() {
    const { battle } = getState()

    let action: BattleAction | null | undefined
    let caster: Battler | null = null

    while (battle.actions.length > 0) {
        action = battle.actions.pop()
        if (!action) {
            continue
        }

        caster = battle.battlers[action.casterId]
        if (caster) {
            if (caster.hp <= 0) {
                action = null
                continue
            }
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

    const targets = targetOpponent(caster, action.targetId, abilityConfig)

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

    if (targetHasDied) {
        battle.isEnding = isTeamDead(battle.teamA) || isTeamDead(battle.teamB)
    }
}

function targetOpponent(caster: Battler, targetId: BattlerId, abilityConfig: AbilityConfig) {
    const { battle } = getState()

    const targetBattler = battle.battlers[targetId]
    if (!targetBattler) {
        return []
    }

    if (abilityConfig.isAoE) {
        const battlers: Battler[] = []
        const targetTeam = targetBattler.isTeamA && abilityConfig.isOffensive ? battle.teamA : battle.teamB
        for (const battlerId of targetTeam) {
            const battler = battle.battlers[battlerId]
            if (battler && battler.hp > 0) {
                battlers.push(battler)
            }
        }

        return battlers
    }

    if (targetBattler && targetBattler.hp > 0) {
        return [targetBattler]
    }

    const targetTeam = caster.isTeamA && abilityConfig.isOffensive ? battle.teamA : battle.teamB
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

    if (battle.status === "waiting" && battle.isAuto) {
        executeAutoBattle()
    }
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
        encounterId: "test_battle",
        id: 0,
        turn: 0,
        selectedAbility: null,
        selectedBattlerId: -1,
        playerBattlerId: -1,
        log: [],
        tCurrent: 0,
        tNextAction: 0,
        isTeamA: true,
        isEnding: false,
        isAuto: false,
    }
}

function toggleBattleAuto() {
    const { battle } = getState()

    battle.isAuto = !battle.isAuto

    updateBattleAuto()
}

function updateBattleAuto() {
    const { battle } = getState()

    setText("battle-auto", battle.isAuto ? "Auto" : "Manual")
}
