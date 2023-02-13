import { canUseAbility, getEnergyNeeded } from "../abilities/abilities-utils"
import { AbilityEffect } from "../abilities/ability-type"
import { AbilityConfigs, AbilityFlag, InstantAbilityConfig } from "../config/ability-configs"
import { BattleConfigs, BattleId } from "../config/battle-configs"
import { LocationConfigs, LocationId } from "../config/location-configs"
import { MonsterConfigs, MonsterId } from "../config/monster-configs"
import { emit } from "../events"
import { Item } from "../inventory/item-types"
import { LootService } from "../inventory/loot-service"
import { LoadoutAbility } from "../loadout/loadout-types"
import { getState } from "../state"
import { BattlerId } from "../types"
import { randomItem, roll, shuffle } from "../utils"
import { updateState } from "./../state"
import { updateView } from "./../view"
import {
    Battle,
    BattleAction,
    BattleActionFlag,
    BattleBattlerLogs,
    BattleLog,
    Battler,
    BattlerAbilityEffect,
    BattleResult,
    BattleTargetLog,
    LocationProgress,
} from "./battle-types"
import { calculatePower, getActionSpeed } from "./battle-utils"
import { addAnimationsFromLogs, addRegenAnimations, updateBattleAnimation } from "./ui/battle-animation"
import "./ui/battle-result"
import "./ui/battle-result-popup"
import { updateBattlerEffects } from "./ui/battler-item"

const AttackAbility: LoadoutAbility = {
    id: "attack",
    rank: 1,
    cooldown: 0,
}

export const BattleService = {
    startFromLocation(locationId: LocationId) {
        const { locations } = getState()

        const location = locations[locationId]
        if (!location) {
            throw new Error(`Location ${locationId} not found`)
        }

        const locationConfig = LocationConfigs[locationId]
        if (locationConfig.type !== "battle" && locationConfig.type !== "boss") {
            throw new Error(`Location ${locationId} is not a battle`)
        }

        const battle = createBattleInstance(locationConfig.battleId)
        battle.locationId = locationId
        battle.status = "waiting"

        updateState({
            battle,
        })

        emit("battle-start", battle)
    },
}

const createBattleInstance = (battleId: BattleId) => {
    const state = getState()
    const { battler, cache } = state

    const encounter = BattleConfigs[battleId]

    const battle = createBattle()
    battle.id = cache.lastBattleId++
    battle.battleId = battleId

    nextTurn()
    addBattler(battle, battler)

    battle.playerBattlerId = battler.id

    for (const monsterId of encounter.monsters) {
        const monsterBattler = createMonsterBattler(monsterId)
        addBattler(battle, monsterBattler)
    }

    return battle
}

const addBattler = (battle: Battle, battler: Battler) => {
    battler.id = battle.battlers.push(battler) - 1

    battle.battlersView.push({
        health: battler.health,
        healthMax: battler.stats.health,
        energy: battler.energy,
        energyMax: battler.stats.energy,
        effects: [],
    })

    if (battler.isTeamA) {
        battle.teamA.push(battler.id)
    } else {
        battle.teamB.push(battler.id)
    }
}

const createMonsterBattler = (monsterId: MonsterId): Battler => {
    const monsterConfig = MonsterConfigs[monsterId]

    return {
        id: 0,
        level: monsterConfig.level,
        name: monsterConfig.name,
        health: monsterConfig.health,
        energy: 1,
        stats: {
            health: monsterConfig.health,
            energy: monsterConfig.energy,
            accuracy: 0,
            attack: monsterConfig.attack,
            critical: 0,
            defense: monsterConfig.defense,
            evasion: 0,
            healing: 0,
            speed: monsterConfig.speed,
            regenEnergy: 1,
            regenHealth: 1,
        },
        effects: [],
        isTeamA: false,
        monsterId,
    }
}

const endBattle = (battle: Battle) => {
    const { loadout } = getState()

    for (const battler of battle.battlers) {
        removeEffects(battler, false)
    }

    updateState({
        battle: createBattle(),
        battleResult: generateBattleResult(battle),
    })

    for (const ability of loadout.abilities) {
        if (ability) {
            ability.cooldown = 0
        }
    }

    emit("battle-end")
}

const generateBattleResult = (battle: Battle): BattleResult => {
    const isVictory = isTeamDead(battle.isTeamA ? battle.teamB : battle.teamA)
    if (!isVictory) {
        return {
            isVictory,
            xp: 0,
            gold: 0,
            loot: [],
            locationProgress: [],
        }
    }

    let exp = 0
    let gold = 0
    const loot: Item[] = []
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
                const newItem = LootService.generateItem(monsterDrop.id, 1, 0)
                loot.push(newItem)
            }
        }
    }

    const locationProgress: LocationProgress[] = []
    if (battle.locationId) {
        locationProgress.push({
            locationId: battle.locationId,
            progress: 1,
            updatedAt: Date.now(),
        })
    }

    return {
        isVictory,
        xp: exp,
        gold,
        loot,
        locationProgress,
    }
}

export function selectAbility(ability: LoadoutAbility | null) {
    const { battle, battler } = getState()

    if (ability && !canUseAbility(battler, ability)) {
        battle.selectedAbility = null
        return
    }

    battle.selectedAbility = ability

    emit("ability-selected", ability)
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
        endBattle(battle)
        return
    }

    battle.status = "waiting"

    emit("battle-next-turn")
}

function regenTurn() {
    const { battle } = getState()

    battle.status = "regen"
    battle.turn += 1
    battle.log.push([])

    const targetsLogs: BattleTargetLog[] = []
    let battlerHasDied = false

    for (let n = 0; n < battle.battlers.length; n += 1) {
        const battler = battle.battlers[n]
        if (battler.health <= 0) {
            continue
        }

        let needUpdateEffects = battler.effects.length > 0
        const targetLogs: BattleLog[] = []

        if (battler.stats.regenHealth) {
            battler.health += battler.stats.regenHealth
            targetLogs.push({
                type: "regen",
                value: battler.stats.regenHealth,
                isEnergy: false,
            })

            if (battler.health <= 0) {
                battler.health = 0
                battlerHasDied = true
                removeBattlerFromTeam(battler)
                targetLogs.push({
                    type: "defeated",
                })
            } else if (battler.health > battler.stats.health) {
                battler.health = battler.stats.health
            }
        }

        if (battler.health > 0) {
            if (battler.stats.regenEnergy) {
                battler.energy += battler.stats.regenEnergy
                targetLogs.push({
                    type: "regen",
                    value: battler.stats.regenEnergy,
                    isEnergy: true,
                })

                if (battler.energy > battler.stats.energy) {
                    battler.energy = battler.stats.energy
                }
            }

            if (updateEffectsDuration(battler, targetLogs, false)) {
                needUpdateEffects = false
            }
        }

        targetsLogs.push({
            battlerId: battler.id,
            logs: targetLogs,
        })

        if (needUpdateEffects) {
            updateBattlerEffects(battler.id)
        }
    }

    battle.tNextAction = addRegenAnimations(battle.tCurrent, targetsLogs)

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
    const targetsLogs: BattleTargetLog[] = new Array(targets.length)
    const casterLogs: BattleLog[] = []

    for (let n = 0; n < targets.length; n += 1) {
        const target = targets[n]
        const targetLogs: BattleLog[] = []

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
                        targetLogs.push({
                            type: "defeated",
                        })
                        removeBattlerFromTeam(target)
                    } else if (target.health > target.stats.health) {
                        target.health = target.stats.health
                    }

                    targetLogs.push({
                        type: "basic",
                        flags,
                        power,
                    })
                    break
                }
            }
        }

        if (abilityConfig.duration > 0) {
            const effect = applyEffects(caster, target, action.ability, abilityConfig)

            targetLogs.push({
                type: "effect-added",
                effectId: effect.id,
                duration: effect.duration,
            })
        }

        targetsLogs[n] = {
            battlerId: target.id,
            logs: targetLogs,
        }
    }

    const logEntry: BattleBattlerLogs = {
        abilityId: action.ability.id,
        casterId: action.casterId,
        targets: targetsLogs,
        casterLogs: null,
        energy: -energyNeeded,
    }

    if (caster.effects.length > 0) {
        updateEffectsDuration(caster, casterLogs, true)

        if (casterLogs) {
            logEntry.casterLogs = {
                battlerId: caster.id,
                logs: casterLogs,
            }
        }
    }

    const turnLog = battle.log[battle.turn - 1]
    turnLog.push(logEntry)

    battle.tNextAction = addAnimationsFromLogs(battle.tCurrent, logEntry)

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
                for (const battler of battle.battlers) {
                    updateBattlerEffects(battler.id)
                }
                nextTurn()
            }
            break
    }
}

export function createBattle(): Battle {
    return {
        status: "preparing",
        battlers: [],
        battlersView: [],
        teamA: [],
        teamB: [],
        actions: [],
        battleId: "test_battle",
        id: 0,
        turn: 1,
        selectedAbility: null,
        selectedBattlerId: -1,
        playerBattlerId: -1,
        log: [[]],
        tCurrent: 0,
        tNextAction: 0,
        isTeamA: true,
        isEnding: false,
        isAuto: false,
        nextEffectId: 0,
        locationId: null,
    }
}

function applyEffects(
    caster: Battler,
    target: Battler,
    ability: LoadoutAbility,
    abilityConfig: InstantAbilityConfig
): BattlerAbilityEffect {
    const { battle } = getState()

    const effects = abilityConfig.durationEffects.map<AbilityEffect>((effect) => {
        return {
            power: ability.rank * effect.power,
            stat: effect.stat,
            type: effect.type,
        }
    })

    let duration = abilityConfig.duration
    if (abilityConfig.flags & AbilityFlag.ExpiresAfterAction) {
        duration += 0.5
    }

    let effect = target.effects.find((effect) => effect.casterId === caster.id && effect.abilityId === abilityConfig.id)
    if (effect) {
        for (const entry of effect.effects) {
            target.stats[entry.stat] -= entry.power
        }

        effect.casterId = caster.id
        effect.duration = duration
        effect.effects = effects
    } else {
        effect = {
            id: battle.nextEffectId++,
            abilityId: abilityConfig.id,
            casterId: caster.id,
            duration,
            effects,
        }
        target.effects.push(effect)
    }

    target.effects.sort((a, b) => b.duration - a.duration)

    for (const effect of effects) {
        target.stats[effect.stat] += effect.power
    }

    return effect
}

function updateEffectsDuration(battler: Battler, targetLogs: BattleLog[], isAction: boolean) {
    const abilityEffects = battler.effects
    if (abilityEffects.length <= 0) {
        return false
    }

    for (let n = 0; n < abilityEffects.length; n += 1) {
        const abilityEffect = abilityEffects[n]
        const abilityConfig = AbilityConfigs[abilityEffect.abilityId] as InstantAbilityConfig

        if (isAction) {
            if (abilityConfig.flags & AbilityFlag.ExpiresAfterAction) {
                abilityEffect.duration -= 1
            }
        } else {
            if ((abilityConfig.flags & AbilityFlag.ExpiresAfterAction) === 0) {
                abilityEffect.duration -= 1
            }
        }
    }

    for (let n = abilityEffects.length - 1; n >= 0; n -= 1) {
        const abilityEffect = abilityEffects[n]

        if (abilityEffect.duration > 0) {
            break
        }

        for (const effect of abilityEffect.effects) {
            battler.stats[effect.stat] -= effect.power
        }

        abilityEffects.pop()
        targetLogs.push({
            type: "effect-removed",
            effectId: abilityEffect.id,
        })
    }
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
