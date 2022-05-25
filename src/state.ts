import { Battler, Card, Item, Skill, SkillId } from "./types"

interface TownStatus {
    cards: Card[]
}

interface PlayerStatus {
    xp: number
    xpMax: number
    stamina: number
    staminaMax: number
    gold: number
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

interface BattleStatus {
    id: number
    cardId: number
    battlers: Battler[]
    battlersA: Battler[]
    battlersB: Battler[]
    tBattle: number
}

interface State {
    player: PlayerStatus
    battler: Battler
    skills: Record<SkillId, Skill>
    inventory: Record<string, Item>
    town: TownStatus
    dungeon: DungeonStatus
    battle: BattleStatus
}

const state: State = {
    player: {
        xp: 0,
        xpMax: 100,
        stamina: 10,
        staminaMax: 10,
        gold: 0,
    },
    battler: {
        id: 0,
        name: "Player",
        level: 1,
        hp: 40,
        hpMax: 40,
        power: 4,
        defense: 1,
        speed: 2,
        isTeamA: true,
        tNextAttack: 0,
    },
    skills: {
        woodcutting: {
            xp: 0,
            xpMax: 100,
            level: 1,
        },
        mining: {
            xp: 0,
            xpMax: 100,
            level: 1,
        },
        fishing: {
            xp: 0,
            xpMax: 100,
            level: 1,
        },
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
    battle: {
        id: -1,
        cardId: -1,
        battlers: [],
        battlersA: [],
        battlersB: [],
        tBattle: 0,
    },
}

export function getState() {
    return state
}
