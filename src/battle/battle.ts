import { canUseAbility, getEnergyNeeded } from "../abilities/abilities-utils"
import { AbilityEffect } from "../abilities/ability-type"
import { AbilityConfigs, AbilityFlag } from "../config/ability-configs"
import { EncounterConfigs, EncounterId } from "../config/encounter-configs"
import { MonsterConfigs } from "../config/monster-configs"
import { removeAllChildren, setOnClick, setShow, setText } from "../dom"
import { PlayerService } from "../player/player-service"
import { getState } from "../state"
import { BattlerId } from "../types"
import { randomItem, randomNumber, roll } from "../utils"
import { InstantAbilityConfig } from "./../config/ability-configs"
import { addCurrency } from "./../currencies/currencies"
import { addItem } from "./../inventory/inventory"
import { LoadoutAbility } from "./../loadout/loadout-types"
import { openPopup } from "./../popup"
import { shuffle } from "./../utils"
import {
    Battle,
    BattleAction,
    BattleActionFlag,
    BattleActionLog,
    BattleActionTarget as BattleActionEffect,
    BattleLootItem,
    Battler,
    BattleRegen,
    BattleRegenTarget,
    BattleResult,
} from "./battle-types"
import { calculatePower, getActionSpeed } from "./battle-utils"
import { addBattler, createMonsterBattler, loadBattlers } from "./battler"
import { loadAbilities, renderAbilities } from "./ui/battle-ability"
import { addAnimationsFromLog, addRegenAnimations, updateBattleAnimation } from "./ui/battle-animation"
import "./ui/battle-result-popup"
import { updateBattlerEffects } from "./ui/battler-item"

const AttackAbility: LoadoutAbility = {
    id: "attack",
    rank: 1,
    cooldown: 0,
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

    for (const battler of state.battle.battlers) {
        removeEffects(battler, false)
    }

    state.battle.status = "ended"
    state.battleResult = generateBattleResult()

    for (const ability of state.loadout.abilities) {
        if (ability) {
            ability.cooldown = 0
        }
    }

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

export function selectAbility(ability: LoadoutAbility | null) {
    const { battle, battler } = getState()

    if (ability && !canUseAbility(battler, ability)) {
        battle.selectedAbility = null
        return
    }

    battle.selectedAbility = ability

    renderBattleStatus()
    renderAbilities()
}

export function useSelectedAbility(targetId: BattlerId) {
    const { battle, battler } = getState()

    if (!battle.selectedAbility) {
        return
    }

    const abilityConfig = AbilityConfigs[battle.selectedAbility.id]
    if (abilityConfig.type === "instant") {
        const needTeamA = abilityConfig.flags & AbilityFlag.Offensive ? !battler.isTeamA : battler.isTeamA
        const target = battle.battlers[targetId]
        if (target.isTeamA !== needTeamA) {
            return
        }
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
    const { loadout, battle } = getState()

    const firstAbility = loadout.abilities[0]
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
        if (battler.health > 0) {
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

    renderAbilities()
    renderBattleStatus()
}

function regenTurn() {
    const { battle } = getState()

    battle.status = "regen"

    const targetRegens: BattleRegenTarget[] = []
    let battlerHasDied = false

    for (const battler of battle.battlers) {
        if (battler.health <= 0) {
            continue
        }

        const regens: BattleRegen[] = []

        if (battler.stats.regenHealth) {
            battler.health += battler.stats.regenHealth
            regens.push({
                abilityId: null,
                value: battler.stats.regenHealth,
                flags: 0,
            })

            if (battler.health <= 0) {
                battler.health = 0
                battlerHasDied = true
                removeBattlerFromTeam(battler)
            } else if (battler.health > battler.stats.health) {
                battler.health = battler.stats.health
            }
        }

        if (battler.health > 0 && battler.stats.regenEnergy) {
            battler.energy += battler.stats.regenEnergy
            regens.push({
                abilityId: null,
                value: battler.stats.regenEnergy,
                flags: BattleActionFlag.Energy,
            })

            if (battler.energy > battler.stats.energy) {
                battler.energy = battler.stats.energy
            }
        }

        targetRegens.push({
            battlerId: battler.id,
            regens,
        })
    }

    battle.tNextAction = addRegenAnimations(battle.tCurrent, targetRegens)

    if (battlerHasDied) {
        battle.isEnding = isTeamDead(battle.teamA) || isTeamDead(battle.teamB)
    }
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
            if (caster.health <= 0) {
                action = null
                continue
            }
            break
        }
    }

    if (!action) {
        regenTurn()
        return
    }
    if (!caster) {
        console.error(`Could not find caster BattlerId. {casterId: ${action.casterId}}`)
        return
    }

    const abilityConfig = AbilityConfigs[action.ability.id] as InstantAbilityConfig

    const energyNeeded = getEnergyNeeded(action.ability)
    caster.energy -= energyNeeded

    action.ability.cooldown = battle.turn + abilityConfig.cooldown

    const targets = targetOpponent(caster, action.targetId, abilityConfig)

    let targetHasDied = false
    const targetsEffects: BattleActionEffect[][] = new Array(targets.length)

    for (let n = 0; n < targets.length; n += 1) {
        const target = targets[n]
        const targetEffects = []

        for (const effect of abilityConfig.effects) {
            let power = 0
            let flags = 0

            switch (effect.type) {
                case "health": {
                    if (abilityConfig.flags & AbilityFlag.Missable) {
                        const hitChance = 100 + caster.stats.accuracy - target.stats.evasion
                        if (!roll(hitChance)) {
                            flags |= BattleActionFlag.Miss
                            power = -1
                            break
                        }
                    }

                    power = calculatePower(caster.stats, effect)

                    const criticalChance = caster.stats.critical - target.stats.critical
                    if (roll(criticalChance)) {
                        flags |= BattleActionFlag.Critical
                        power *= 1.25 | 0
                    }

                    target.health += power

                    if (target.health <= 0) {
                        target.health = 0
                        targetHasDied = true
                        removeBattlerFromTeam(target)
                    } else if (target.health > target.stats.health) {
                        target.health = target.stats.health
                    }

                    targetEffects.push({
                        battlerId: target.id,
                        abilityId: null,
                        flags,
                        power,
                    })
                    break
                }
            }
        }

        if (abilityConfig.duration > 0) {
            targetEffects.push({
                battlerId: target.id,
                abilityId: abilityConfig.id,
                flags: 0,
                power: 0,
            })
        }

        targetsEffects[n] = targetEffects

        removeExpiredEffects(target)
        tryApplyEffects(caster, target, action.ability, abilityConfig)
    }

    const logEntry: BattleActionLog = {
        abilityId: action.ability.id,
        casterId: action.casterId,
        targets: targetsEffects,
        energy: -energyNeeded,
    }
    const turnLog = battle.log[battle.turn - 1]
    turnLog.push(logEntry)

    battle.tNextAction = addAnimationsFromLog(battle.tCurrent, logEntry)

    if (targetHasDied) {
        battle.isEnding = isTeamDead(battle.teamA) || isTeamDead(battle.teamB)
    }
}

function targetOpponent(caster: Battler, targetId: BattlerId, abilityConfig: InstantAbilityConfig) {
    const { battle } = getState()

    const targetBattler = battle.battlers[targetId]
    if (!targetBattler) {
        return []
    }

    if (abilityConfig.flags & AbilityFlag.Self) {
        return [caster]
    }

    if (abilityConfig.flags & AbilityFlag.AoE) {
        const battlers: Battler[] = []
        const targetTeam = caster.isTeamA && abilityConfig.flags & AbilityFlag.Offensive ? battle.teamB : battle.teamA
        for (const battlerId of targetTeam) {
            const battler = battle.battlers[battlerId]
            if (battler && battler.health > 0) {
                battlers.push(battler)
            }
        }

        return battlers
    }

    if (targetBattler && targetBattler.health > 0) {
        return [targetBattler]
    }

    const targetTeam = caster.isTeamA && abilityConfig.flags & AbilityFlag.Offensive ? battle.teamB : battle.teamA
    for (const battlerId of targetTeam) {
        const battler = battle.battlers[battlerId]
        if (battler && battler.health > 0) {
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
    removeEffects(battlerToRemove)
}

export function updateBattle(tDelta: number) {
    const { battle } = getState()

    if (battle.id === -1) {
        return
    }

    battle.tCurrent += tDelta

    updateBattleAnimation(battle.tCurrent)

    switch (battle.status) {
        case "waiting":
            if (battle.isAuto) {
                executeAutoBattle()
            }
            break

        case "executing":
            if (battle.tNextAction <= battle.tCurrent) {
                nextAction()
            }
            break

        case "regen":
            if (battle.tNextAction <= battle.tCurrent) {
                nextTurn()
            }
            break
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

function tryApplyEffects(caster: Battler, target: Battler, ability: LoadoutAbility, abilityConfig: InstantAbilityConfig) {
    if (!abilityConfig.duration) {
        return
    }

    const { battle } = getState()

    const duration = battle.turn + abilityConfig.duration
    const effects = abilityConfig.durationEffects.map<AbilityEffect>((effect) => {
        return {
            power: ability.rank * effect.power,
            stat: effect.stat,
            type: effect.type,
        }
    })

    const prevEffect = target.effects.find((effect) => effect.casterId === caster.id && effect.abilityId === abilityConfig.id)
    if (prevEffect) {
        for (const effect of prevEffect.effects) {
            target.stats[effect.stat] -= effect.power
        }

        prevEffect.casterId = caster.id
        prevEffect.duration = duration
        prevEffect.effects = effects
    } else {
        target.effects.push({
            abilityId: abilityConfig.id,
            casterId: caster.id,
            duration: battle.turn + abilityConfig.duration,
            effects,
        })
    }

    target.effects.sort((a, b) => b.duration - a.duration)

    for (const effect of effects) {
        target.stats[effect.stat] += effect.power
    }
}

function removeExpiredEffects(battler: Battler) {
    const { battle } = getState()

    const abilityEffects = battler.effects
    if (abilityEffects.length <= 0) {
        return
    }

    for (let n = abilityEffects.length - 1; n >= 0; n -= 1) {
        const abilityEffect = abilityEffects[n]
        if (abilityEffect.duration > battle.turn) {
            return
        }

        for (const effect of abilityEffect.effects) {
            battler.stats[effect.stat] -= effect.power
        }

        abilityEffects.pop()
    }

    updateBattlerEffects(battler.id)
}

function removeEffects(battler: Battler, updateUI = true) {
    const abilityEffects = battler.effects
    if (abilityEffects.length <= 0) {
        return
    }

    for (let n = abilityEffects.length - 1; n >= 0; n -= 1) {
        const abilityEffect = abilityEffects[n]

        for (const effect of abilityEffect.effects) {
            battler.stats[effect.stat] -= effect.power
        }

        abilityEffects.pop()
    }

    if (updateUI) {
        updateBattlerEffects(battler.id)
    }
}
