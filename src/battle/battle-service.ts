import { SkillConfigs, SkillFlag, InstantSkillConfig } from "../config/skill-configs"
import { BattleConfigs, BattleId } from "../config/battle-configs"
import { LocationConfigs, LocationId } from "../config/location-configs"
import { MonsterConfigs, MonsterId } from "../config/monster-configs"
import { emit } from "../events"
import { Item } from "../inventory/item-types"
import { LootService } from "../inventory/loot-service"
import { LoadoutSkill } from "../loadout/loadout-types"
import { getState } from "../state"
import { BattlerId } from "../types"
import { randomItem, roll, shuffle } from "../utils"
import { PopupService } from "./../popup"
import { updateState } from "./../state"
import {
    Battle,
    BattleAction,
    BattleActionFlag,
    BattleBattlerLogs,
    BattleLog,
    Battler,
    BattlerSkillEffect,
    BattleResult,
    BattleTargetLog,
    LocationProgress,
} from "./battle-types"
import { getActionSpeed, getPower } from "./battle-utils"
import { addAnimationsFromLogs, addRegenAnimations, updateBattleAnimation } from "./ui/battle-animation"
import "./ui/battle-result"
import "./ui/battle-result-popup"
import { updateBattlerEffects } from "./ui/battler-item"
import { canUseSkill, getEnergyNeeded } from "../skills/skills-utils"
import { ElementType } from "../skills/skills-types"
import { SkillEffect } from "./../skills/skills-types"

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

        PopupService.closeAll()

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
        energy: battler.mana,
        energyMax: battler.stats.mana,
        effects: [],
    })

    if (battler.isTeamA) {
        battle.teamA.push(battler.id)
    } else {
        battle.teamB.push(battler.id)
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

export function selectSkill(skill: LoadoutSkill | null) {
    const { battle, battler } = getState()

    if (skill && !canUseSkill(battler, skill)) {
        battle.selectedSkill = null
        return
    }

    battle.selectedSkill = skill

    emit("ability-selected", skill)
}

export function useSelectedAbility(targetId: BattlerId) {
    const { battle, battler } = getState()

    if (!battle.selectedSkill) {
        return
    }

    const abilityConfig = SkillConfigs[battle.selectedSkill.id]
    if (abilityConfig.type === "instant") {
        const needTeamA = abilityConfig.flags & SkillFlag.Offensive ? !battler.isTeamA : battler.isTeamA
        const target = battle.battlers[targetId]
        if (target.isTeamA !== needTeamA) {
            return
        }
    }

    battle.actions.push({
        casterId: battler.id,
        targetId,
        skill: battle.selectedSkill,
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

    selectSkill(firstAbility)
    useSelectedAbility(targetId)
}

function updateAI() {
    const { battle } = getState()

    for (const battlerId of battle.teamB) {
        const battler = battle.battlers[battlerId]
        if (!battler.monsterId) {
            continue
        }

        const monsterConfig = MonsterConfigs[battler.monsterId]
        const firstOption = monsterConfig.ai[0]
        const monsterAbility = monsterConfig.abilities[firstOption.abilityId]
        const targetId = randomItem(battle.teamA)

        battle.actions.push({
            casterId: battler.id,
            targetId,
            skill: {
                id: monsterAbility.id,
                rank: monsterAbility.rank,
                cooldown: 0,
            },
            speed: getActionSpeed(battler.stats.speed),
        })
    }
}

function startExecutingTurn() {
    const { battle } = getState()

    battle.status = "executing"

    selectSkill(null)

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
            if (battler.stats.regenMana) {
                battler.mana += battler.stats.regenMana
                targetLogs.push({
                    type: "regen",
                    value: battler.stats.regenMana,
                    isEnergy: true,
                })

                if (battler.mana > battler.stats.mana) {
                    battler.mana = battler.stats.mana
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

    const abilityConfig = SkillConfigs[action.skill.id] as InstantSkillConfig

    const energyNeeded = getEnergyNeeded(action.skill)
    caster.mana -= energyNeeded

    action.skill.cooldown = battle.turn + abilityConfig.cooldown

    const targets = targetOpponent(caster, action.targetId, abilityConfig)

    let targetHasDied = false
    const targetsLogs: BattleTargetLog[] = new Array(targets.length)
    const casterLogs: BattleLog[] = []

    for (let n = 0; n < targets.length; n += 1) {
        const target = targets[n]
        const targetLogs: BattleLog[] = []

        const resistance = calculateResistance(caster, target, abilityConfig.element)

        for (const effect of abilityConfig.effects) {
            let power = 0
            let powerModifier = 1.0
            let flags = 0

            switch (effect.type) {
                case "health": {
                    const criticalChance = caster.stats.critical - target.stats.critical
                    if (roll(criticalChance)) {
                        flags |= BattleActionFlag.Critical
                        powerModifier *= 1.25 | 0
                    } else if (abilityConfig.flags & SkillFlag.Missable) {
                        const hitChance = 100 + caster.stats.accuracy - target.stats.evasion
                        if (!roll(hitChance)) {
                            flags |= BattleActionFlag.Miss
                            powerModifier = -1
                            break
                        }
                    }

                    power = getPower(caster.stats[effect.stat]) * powerModifier * effect.power
                    if (power < 0) {
                        power *= resistance
                    }

                    power = Math.floor(power)
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
            const effect = applyEffects(caster, target, action.skill, abilityConfig)

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
        skillId: action.skill.id,
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

function targetOpponent(caster: Battler, targetId: BattlerId, abilityConfig: InstantSkillConfig) {
    const { battle } = getState()

    const targetBattler = battle.battlers[targetId]
    if (!targetBattler) {
        return []
    }

    if (abilityConfig.flags & SkillFlag.Self) {
        return [caster]
    }

    if (abilityConfig.flags & SkillFlag.AoE) {
        const battlers: Battler[] = []
        const targetTeam = caster.isTeamA && abilityConfig.flags & SkillFlag.Offensive ? battle.teamB : battle.teamA
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

    const targetTeam = caster.isTeamA && abilityConfig.flags & SkillFlag.Offensive ? battle.teamB : battle.teamA
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
        selectedSkill: null,
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

function applyEffects(caster: Battler, target: Battler, skill: LoadoutSkill, abilityConfig: InstantSkillConfig): BattlerSkillEffect {
    const { battle } = getState()

    const effects = abilityConfig.durationEffects.map<SkillEffect>((effect) => {
        return {
            power: skill.rank * effect.power,
            stat: effect.stat,
            type: effect.type,
        }
    })

    let duration = abilityConfig.duration
    if (abilityConfig.flags & SkillFlag.ExpiresAfterAction) {
        duration += 0.5
    }

    let effect = target.effects.find((effect) => effect.casterId === caster.id && effect.skillId === abilityConfig.id)
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
            skillId: abilityConfig.id,
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
        const abilityConfig = SkillConfigs[abilityEffect.skillId] as InstantSkillConfig

        if (isAction) {
            if (abilityConfig.flags & SkillFlag.ExpiresAfterAction) {
                abilityEffect.duration -= 1
            }
        } else {
            if ((abilityConfig.flags & SkillFlag.ExpiresAfterAction) === 0) {
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

const calculateResistance = (caster: Battler, target: Battler, elementType: ElementType): number => {
    let targetResistance = 0

    switch (elementType) {
        case "fire":
            targetResistance = target.stats.fireResistance
            break
        case "water":
            targetResistance = target.stats.waterResistance
            break
        case "earth":
            targetResistance = target.stats.earthResistance
            break
        case "air":
            targetResistance = target.stats.airResistance
            break
    }

    const level = target.level + (target.level - caster.level)
    const resistancePerLevel = 5

    let resistance = targetResistance / (targetResistance + level * resistancePerLevel)
    if (resistance > 0.75) {
        resistance = 0.75
    }

    return 1.0 - resistance
}

const createMonsterBattler = (monsterId: MonsterId): Battler => {
    const monsterConfig = MonsterConfigs[monsterId]

    return {
        id: 0,
        level: monsterConfig.level,
        name: monsterConfig.name,
        health: monsterConfig.health,
        mana: 1,
        stats: {
            health: monsterConfig.health,
            mana: monsterConfig.energy,
            accuracy: 0,
            critical: 0,
            evasion: 0,
            speed: monsterConfig.speed,
            regenMana: 1,
            regenHealth: 1,
            firePower: monsterConfig.firePower,
            waterPower: monsterConfig.waterPower,
            earthPower: monsterConfig.earthPower,
            airPower: monsterConfig.airPower,
            fireResistance: monsterConfig.fireResistance,
            waterResistance: monsterConfig.waterResistance,
            earthResistance: monsterConfig.earthResistance,
            airResistance: monsterConfig.airResistance,
        },
        effects: [],
        isTeamA: false,
        monsterId,
    }
}
