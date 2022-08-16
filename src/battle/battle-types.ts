import { AbilityId } from "../config/ability-configs"
import { Ability } from "../state"
import { BattlerId } from "../types"
import { CharacterStats } from "./../character/character-types"

export interface BattleAction {
    casterId: BattlerId
    targetId: BattlerId
    ability: Ability
    speed: number
}

export interface Battle {
    id: number
    cardId: number
    status: "preparing" | "waiting" | "executing" | "ended"
    battlers: Battler[]
    battlersView: BattlerView[]
    teamA: BattlerId[]
    teamB: BattlerId[]
    actions: BattleAction[]
    turn: number
    selectedAbility: Ability | null
    selectedBattlerId: BattlerId
    playerBattlerId: BattlerId
    log: BattleActionLog[][]
    tCurrent: number
    tNextAction: number
    isTeamA: boolean
    isEnding: boolean
    isAuto: boolean
}

export interface BattleResult {
    isVictory: boolean
}

export interface Battler {
    id: number
    level: number
    name: string
    hp: number
    hpMax: number
    stats: CharacterStats
    isTeamA: boolean
    isAI: boolean
}

export interface BattlerView {
    hp: number
    hpMax: number
}

export interface BattleActionTarget {
    battlerId: BattlerId
    power: number
    isCritical: boolean
    isMiss: boolean
}

export interface BattleActionLog {
    abilityId: AbilityId
    casterId: BattlerId
    targets: BattleActionTarget[]
}
