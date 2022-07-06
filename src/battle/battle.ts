import { AbilityConfigs } from "../config/ability-configs"
import { StartBattleAction } from "../config/CardConfigs"
import { removeAllChildren, setShow } from "../dom"
import { Ability, getState } from "../state"
import { updatePlayerStatus } from "../status"
import { Battler, BattlerId } from "../types"
import { randomItem, roll } from "../utils"
import { BattleAction } from "./../state"
import { shuffle } from "./../utils"
import { loadAbilities, updateAbilities } from "./battle-ability"
import { updateBattleStatus } from "./battle-status"
import { BattleActionTarget } from "./battle-types"
import { getActionSpeed } from "./battle-utils"
import { addBattler, createMonsterBattler, loadBattlers } from "./battler"

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
    updateBattleStatus()

    setShow("area-battle", true)
}

function endBattle() {
    const state = getState()

    state.battle = {
        battlers: [],
        teamA: [],
        teamB: [],
        actions: [],
        animations: [],
        animationsActive: [],
        cardId: -1,
        id: 0,
        tCurrent: 0,
        turn: 0,
        selectedAbility: null,
        selectedBattlerId: -1,
        isTeamA: true,
        playerBattlerId: -1,
        log: [],
    }

    setShow("area-battle", false)

    updatePlayerStatus()
    setShow("area-town", true)

    removeAllChildren("battle-column-a")
    removeAllChildren("battle-column-b")
    removeAllChildren("battle-abilities")
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

    battle.selectedAbility = null
    updateAbilities()

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

    shuffle(battle.actions)
    battle.actions.sort((a, b) => b.speed - a.speed)

    updateTurn()
}

function handleNextAction() {
    const { battle } = getState()

    if (battle.actions.length <= 0) {
        endTurn()
        return
    }

    let offset = 0

    for (const action of battle.actions) {
        const abilityConfig = AbilityConfigs[action.ability.id]
        const tStart = battle.tCurrent + offset

        battle.animations.push({
            type: "forward",
            battlerId: action.casterId,
            tStart,
            tEnd: tStart + 1600,
        })

        battle.animations.push({
            type: "ability-use",
            battlerId: action.casterId,
            tStart: tStart + 100,
            tEnd: tStart + 900,
            abilityId: action.ability.id,
        })

        if (abilityConfig.isOffensive) {
            battle.animations.push({
                type: "shake",
                battlerId: action.targetId,
                tStart: tStart + 500,
                tEnd: tStart + 1600,
            })
        }

        for (const effect of abilityConfig.effects) {
            battle.animations.push({
                type: "scrolling-text",
                battlerId: action.targetId,
                tStart: tStart + 500,
                tEnd: 0,
                value: effect.power,
                isCritical: true,
                isMiss: false,
            })
        }

        offset += 1000
    }

    battle.animations.sort((a, b) => b.tStart - a.tStart)
}

// function handleAction(action: BattleAction) {
//     const { battle } = getState()

//     const enemyBattlerIds = action.battler.isTeamA ? battle.battlersB : battle.battlersA
//     const targetId = randomItem(enemyBattlerIds)
//     const target = battle.battlers[targetId]

//     target.hp -= action.battler.power - target.defense
//     if (target.hp <= 0) {
//         target.hp = 0

//         if (isTeamDead(enemyBattlerIds)) {
//             return true
//         }
//     }

//     updateBattler(target)

//     return false
// }

function endTurn() {
    const { battle } = getState()

    battle.turn += 1
    battle.actions.length = 0

    updateBattleStatus()
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

    console.log("next-turn")
}

function updateTurn() {
    const { battle } = getState()

    let action: BattleAction | undefined
    let caster: Battler | null = null
    while (battle.actions.length > 0) {
        action = battle.actions.pop()
        if (!action) {
            continue
        }

        caster = battle.battlers[action.casterId]
        if (caster && caster.hp > 0) {
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
                    break
                }

                case "hp-plus": {
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
}

const targetOpponent = (caster: Battler, targetId: BattlerId) => {
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

export function updateBattle(tDelta: number) {
    const { battle } = getState()

    if (battle.id === -1) {
        return
    }

    battle.tCurrent += tDelta

    // updateBattleAnimation()

    // if (battle.animations.length > 0) {
    //     return
    // }
}
