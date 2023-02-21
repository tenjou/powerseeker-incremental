export interface CharacterStats {
    health: number
    mana: number
    attack: number
    defense: number
    healing: number
    accuracy: number
    evasion: number
    speed: number
    critical: number
    regenHealth: number
    regenMana: number
}

export type CharacterStatType = keyof CharacterStats
