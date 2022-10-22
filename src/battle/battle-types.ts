import { AbilityEffect } from "../abilities/ability-type"
import { AbilityId } from "../config/ability-configs"
import { EncounterId } from "../config/encounter-configs"
import { ItemId } from "../config/item-configs"
import { MonsterId } from "../config/monster-configs"
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
    encounterId: EncounterId
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
    targetId: BattlerId
    power: number
    flags: number
}

interface BattleLogEffectAdded {
    type: "effect-added"
    targetId: BattlerId
    effectId: number
    duration: number
}

interface BattleLogEffectRemoved {
    type: "effect-removed"
    targetId: BattlerId
    effectId: number
}

export type BattleLog = BattleLogBasic | BattleLogEffectAdded | BattleLogEffectRemoved

export interface BattleBattlerLogs {
    casterId: BattlerId
    abilityId: AbilityId
    targets: BattleLog[][]
    energy: number
}

export interface BattleLootItem {
    id: ItemId
    amount: number
    power?: number
    rarity?: number
}

export interface BattleResult {
    isVictory: boolean
    exp: number
    gold: number
    loot: BattleLootItem[]
}

export interface BattleRegen {
    abilityId: AbilityId | null
    value: number
    flags: BattleActionFlag
}

export interface BattleRegenTarget {
    battlerId: BattlerId
    regens: BattleRegen[]
}
