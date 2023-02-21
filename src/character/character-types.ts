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
    fireResistance: number
    waterResistance: number
    earthResistance: number
    windResistance: number
    lightResistance: number
    darkResistance: number
}

export type CharacterStatType = keyof CharacterStats
