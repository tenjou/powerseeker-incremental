export interface CharacterStats {
    health: number
    energy: number
    attack: number
    defense: number
    healing: number
    accuracy: number
    evasion: number
    speed: number
    critical: number
}

export type CharacterStatType = keyof CharacterStats
