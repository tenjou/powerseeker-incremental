import { Card, Item, Skill, SkillId, Status } from "./types"

interface TownStatus {
    cards: Card[]
}

interface DungeonStatus {
    id: string
    parentCardId: number
    stage: number
    progress: number
    cards: Card[]
    stageCompleted: boolean
    reachedEnd: boolean
}

interface CharacterStats {
    level: number
    hp: number
    hpMax: number
    power: number
    defense: number
}

interface State {
    status: Status
    stats: CharacterStats
    skills: Record<SkillId, Skill>
    inventory: Record<string, Item>
    town: TownStatus
    dungeon: DungeonStatus
}

const state: State = {
    stats: {
        level: 1,
        hp: 40,
        hpMax: 40,
        power: 4,
        defense: 1,
    },
    skills: {
        woodcutting: {
            exp: 0,
            expMax: 100,
            level: 1,
        },
        mining: {
            exp: 0,
            expMax: 100,
            level: 1,
        },
        fishing: {
            exp: 0,
            expMax: 100,
            level: 1,
        },
    },
    status: {
        stamina: 10,
        staminaMax: 10,
        gold: 0,
    },
    inventory: {},
    town: {
        cards: [],
    },
    dungeon: {
        id: "",
        parentCardId: -1,
        stage: -1,
        progress: -1,
        cards: [],
        stageCompleted: false,
        reachedEnd: false,
    },
}

export function getState() {
    return state
}
