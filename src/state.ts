import { Battle, Battler, BattleResult } from "./battle/battle-types"
import { createEmptyStats } from "./character/status"
import { AbilityId } from "./config/ability-configs"
import { ItemId } from "./config/item-configs"
import { CurrencyType } from "./currencies/currency-types"
import { Card, Item, Skill, SlotType } from "./types"

interface TownStatus {
    cards: Card[]
}

interface PlayerStatus {
    level: number
    name: string
    xp: number
    xpMax: number
    power: number
    stamina: number
    staminaMax: number
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
    id: AbilityId
    rank: number
}

interface Cache {
    lastItemIndex: number
    lastCardIndex: number
    lastBattleId: number
}

interface State {
    player: PlayerStatus
    currencies: Record<CurrencyType, number>
    equipment: Record<SlotType, Item | null>
    battler: Battler
    skills: Skill[]
    inventory: Item[]
    abilities: Record<AbilityId, Ability>
    loadout: {
        abilities: (AbilityId | null)[]
        items: (ItemId | null)[]
    }
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
        power: 0,
        stamina: 10,
        staminaMax: 10,
    },
    currencies: {
        ap: 1,
        gold: 134,
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
    abilities: {
        attack: { id: "attack", rank: 1 },
        bash: { id: "bash", rank: 1 },
        heal: { id: "heal", rank: 1 },
    },
    loadout: {
        abilities: ["attack", "bash", "heal", null],
        items: [null],
    },
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
