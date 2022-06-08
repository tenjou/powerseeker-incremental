import { Battler, Card, Item, Skill, SkillId, SlotType } from "./types"

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

export interface BattleAction {
    battler: Battler
    ability: Ability
}

interface Battle {
    id: number
    cardId: number
    battlersA: Battler[]
    battlersB: Battler[]
    actions: BattleAction[]
    tBattle: number
    turn: number
}

export interface Ability {
    id: string
    rank: number
}

interface Cache {
    lastItemIndex: number
    lastCardIndex: number
    lastBattleId: number
}

interface State {
    player: PlayerStatus
    equipment: Record<SlotType, Item | null>
    battler: Battler
    skills: Record<SkillId, Skill>
    inventory: Item[]
    abilities: Ability[]
    town: TownStatus
    dungeon: DungeonStatus
    battle: Battle
    cache: Cache
}

let state: State = {
    player: {
        xp: 0,
        xpMax: 100,
        stamina: 10,
        staminaMax: 10,
        gold: 0,
    },
    equipment: {
        body: null,
        hand_1: null,
    },
    battler: {
        id: 0,
        name: "Player",
        level: 1,
        hp: 10,
        hpMax: 40,
        power: 4,
        defense: 0,
        speed: 2,
        isTeamA: true,
        isAI: false,
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
    inventory: [],
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
        id: 0,
        cardId: 0,
        battlersA: [],
        battlersB: [],
        actions: [],
        tBattle: 0,
        turn: 1,
    },
    abilities: [
        {
            id: "attack",
            rank: 1,
        },
        {
            id: "bash",
            rank: 1,
        },
    ],
    cache: {
        lastItemIndex: 1,
        lastCardIndex: 1,
        lastBattleId: 1,
    },
}

export function loadState(newState: State) {
    state = newState
}

export function getState() {
    return state
}
