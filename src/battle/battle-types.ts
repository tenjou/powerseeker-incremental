import { AbilityId, BattlerId } from "../types"

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
