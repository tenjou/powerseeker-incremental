import { BattleId } from "../config/battle-configs"
import { LocationId } from "../config/location-configs"
import { MonsterId } from "../config/monster-configs"
import { SkillId } from "../config/skill-configs"
import { Item } from "../inventory/item-types"
import { LoadoutSkill } from "../loadout/loadout-types"
import { SkillEffect } from "../skills/skills-types"
import { BattlerId } from "../types"
import { CharacterStats } from "./../character/character-types"

export interface BattleAction {
    casterId: BattlerId
    targetId: BattlerId
    skill: LoadoutSkill
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
    selectedSkill: LoadoutSkill | null
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

export interface BattlerSkillEffect {
    id: number
    skillId: SkillId
    casterId: BattlerId
    effects: SkillEffect[]
    duration: number
}

export interface Battler {
    id: number
    level: number
    name: string
    health: number
    mana: number
    stats: CharacterStats
    effects: BattlerSkillEffect[]
    isTeamA: boolean
    monsterId: MonsterId | null
}

export interface BattlerViewEffect {
    id: number
    skillId: SkillId
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
    Block = 8,
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
    updatedAt: number
}

export type BattleLog = BattleLogBasic | BattleLogEffectAdded | BattleLogEffectRemoved | BattleLogRegen | BattleLogDefeated

export interface BattleTargetLog {
    battlerId: BattlerId
    logs: BattleLog[]
}

export interface BattleBattlerLogs {
    casterId: BattlerId
    skillId: SkillId
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
