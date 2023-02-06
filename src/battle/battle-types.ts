import { AbilityEffect } from "../abilities/ability-type"
import { AbilityId } from "../config/ability-configs"
import { BattleId } from "../config/battle-configs"
import { ItemId } from "../config/item-configs"
import { LocationId } from "../config/location-configs"
import { MonsterId } from "../config/monster-configs"
import { Item } from "../inventory/item-types"
import { BattlerId } from "../types"
import { CharacterStats } from "./../character/character-types"
import { LoadoutAbility } from "./../loadout/loadout-types"

export interface BattleAction {
    casterId: BattlerId
    targetId: BattlerId
    ability: LoadoutAbility
    speed: number
}

export interface Battle {
    id: number
    battleId: BattleId
    status: "preparing" | "waiting" | "executing" | "regen" | "ended"
    battlers: Battler[]
    battlersView: BattlerView[]
    teamA: BattlerId[]
    teamB: BattlerId[]
    actions: BattleAction[]
    turn: number
    selectedAbility: LoadoutAbility | null
    selectedBattlerId: BattlerId
    playerBattlerId: BattlerId
    log: BattleBattlerLogs[][]
    tCurrent: number
    tNextAction: number
    isTeamA: boolean
    isEnding: boolean
    isAuto: boolean
    nextEffectId: number
    locationId: LocationId | null
}

export interface BattlerAbilityEffect {
    id: number
    abilityId: AbilityId
    casterId: BattlerId
    effects: AbilityEffect[]
    duration: number
}

export interface Battler {
    id: number
    level: number
    name: string
    health: number
    energy: number
    stats: CharacterStats
    effects: BattlerAbilityEffect[]
    isTeamA: boolean
    monsterId: MonsterId | null
}

export interface BattlerViewEffect {
    id: number
    abilityId: AbilityId
    duration: number
    appliedOnTurn: number
}

export interface BattlerView {
    health: number
    healthMax: number
    energy: number
    energyMax: number
    effects: BattlerViewEffect[]
}

export enum BattleActionFlag {
    Critical = 1,
    Miss = 2,
    Energy = 4,
}

export interface BattleLogBasic {
    type: "basic"
    power: number
    flags: number
}

interface BattleLogEffectAdded {
    type: "effect-added"
    effectId: number
    duration: number
}

interface BattleLogEffectRemoved {
    type: "effect-removed"
    effectId: number
}

interface BattleLogRegen {
    type: "regen"
    value: number
    isEnergy: boolean
}

interface BattleLogDefeated {
    type: "defeated"
}

export interface LocationProgress {
    locationId: LocationId
    progress: number
}

export type BattleLog = BattleLogBasic | BattleLogEffectAdded | BattleLogEffectRemoved | BattleLogRegen | BattleLogDefeated

export interface BattleTargetLog {
    battlerId: BattlerId
    logs: BattleLog[]
}

export interface BattleBattlerLogs {
    casterId: BattlerId
    abilityId: AbilityId
    targets: BattleTargetLog[]
    casterLogs: BattleTargetLog | null
    energy: number
}

export interface BattleResult {
    isVictory: boolean
    xp: number
    gold: number
    loot: Item[]
    locationProgress: LocationProgress[]
}
