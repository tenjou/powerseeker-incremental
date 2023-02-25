export interface CharacterStats {
    health: number
    mana: number
    regenHealth: number
    regenMana: number
    accuracy: number
    evasion: number
    critical: number
    speed: number
    firePower: number
    waterPower: number
    earthPower: number
    airPower: number
    fireResistance: number
    waterResistance: number
    earthResistance: number
    airResistance: number
}

export type CharacterStatType = keyof CharacterStats
