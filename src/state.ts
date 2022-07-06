import { BattleAnimation } from "./battle/battle-animation"
import { BattleActionLog, Battler, BattlerView } from "./battle/battle-types"
import { BattlerId, Card, Item, Skill, SkillId, SlotType } from "./types"

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

export interface BattleAction {
    casterId: BattlerId
    targetId: BattlerId
    ability: Ability
    speed: number
}

interface Battle {
    id: number
    cardId: number
    battlers: Battler[]
    battlersView: BattlerView[]
    teamA: BattlerId[]
    teamB: BattlerId[]
    actions: BattleAction[]
    animations: BattleAnimation[]
    animationsActive: BattleAnimation[]
    tCurrent: number
    turn: number
    selectedAbility: Ability | null
    selectedBattlerId: BattlerId
    isTeamA: boolean
    playerBattlerId: BattlerId
    log: BattleActionLog[][]
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
        hand_1: null,
    },
    battler: {
        id: 0,
        level: 1,
        name: "Player",
        hp: 10,
        hpMax: 40,
        stats: {
            accuracy: 0,
            attack: 4,
            critical: 0,
            defense: 0,
            evasion: 0,
            healing: 1,
            speed: 2,
        },
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
        battlers: [],
        battlersView: [],
        teamA: [],
        teamB: [],
        actions: [],
        animations: [],
        animationsActive: [],
        tCurrent: 0,
        turn: 1,
        selectedAbility: null,
        selectedBattlerId: -1,
        isTeamA: true,
        playerBattlerId: -1,
        log: [],
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
