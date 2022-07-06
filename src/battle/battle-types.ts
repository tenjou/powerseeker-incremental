import { AbilityId, BattlerId } from "../types"

export interface CharacterStats {
    attack: number
    defense: number
    healing: number
    accuracy: number
    evasion: number
    speed: number
    critical: number
}

export type CharacterStatType = keyof CharacterStats

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
