import { Battle, BattleResult, Battler } from "./battle/battle-types"
import { createEmptyStats } from "./character/status"
import { Card, Item, Skill, SkillId, SlotType } from "./types"

interface TownStatus {
    cards: Card[]
}

interface PlayerStatus {
    level: number
    name: string
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
    skills: Skill[]
    inventory: Item[]
    abilities: Ability[]
    town: TownStatus
    dungeon: DungeonStatus
    battle: Battle
    battleResult: BattleResult | null
    cache: Cache
}

let state: State = {
    player: {
        level: 1,
        name: "Player",
        xp: 0,
        xpMax: 100,
        stamina: 10,
        staminaMax: 10,
        gold: 0,
    },
    equipment: {
        body: null,
        main_hand: null,
    },
    battler: {
        id: 0,
        level: 1,
        name: "Player",
        hp: 10,
        hpMax: 40,
        stats: createEmptyStats(),
        isTeamA: true,
        isAI: false,
    },
    skills: [
        {
            id: "woodcutting",
            xp: 0,
            xpMax: 100,
            level: 1,
        },
        {
            id: "mining",
            xp: 0,
            xpMax: 100,
            level: 1,
        },
        {
            id: "fishing",
            xp: 0,
            xpMax: 100,
            level: 1,
        },
    ],
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
        status: "preparing",
        battlers: [],
        battlersView: [],
        teamA: [],
        teamB: [],
        actions: [],
        turn: 1,
        selectedAbility: null,
        selectedBattlerId: -1,
        playerBattlerId: -1,
        log: [],
        tCurrent: 0,
        tNextAction: 0,
        isTeamA: true,
        isEnding: false,
        isAuto: false,
    },
    battleResult: null,
    abilities: [
        {
            id: "attack",
            rank: 1,
        },
        {
            id: "bash",
            rank: 1,
        },
        {
            id: "heal",
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
