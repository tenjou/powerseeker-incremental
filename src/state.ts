import { Ability } from "./abilities/ability-type"
import { createBattle } from "./battle/battle"
import { Battle, Battler, BattleResult } from "./battle/battle-types"
import { createEmptyStats } from "./character/status"
import { AbilityId } from "./config/ability-configs"
import { AreaId, LocationId } from "./config/area-configs"
import { EquipmentSlot, ItemId } from "./config/item-configs"
import { JobId } from "./config/job-configs"
import { CurrencyType } from "./currencies/currency-types"
import { Item } from "./inventory/item-types"
import { JobsService } from "./jobs/jobs-service"
import { Job } from "./jobs/jobs-types"
import { LoadoutAbility } from "./loadout/loadout-types"
import { Card, Skill } from "./types"
import { AreaState, ExplorationState, LocationState } from "./world/world-types"

interface TownStatus {
    cards: Card[]
}

interface PlayerStatus {
    name: string
    jobPrimary: JobId
    jobSecondary: JobId | null
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

interface Cache {
    lastItemIndex: number
    lastEntityIndex: number
    lastBattleId: number
}

interface State {
    player: PlayerStatus
    jobs: Partial<Record<JobId, Job>>
    currencies: Record<CurrencyType, number>
    equipment: Record<EquipmentSlot, Item | null>
    battler: Battler
    skills: Skill[]
    inventory: Item[]
    abilities: Record<AbilityId, Ability>
    loadout: {
        abilities: (LoadoutAbility | null)[]
        items: (ItemId | null)[]
    }
    areas: Partial<Record<AreaId, AreaState>>
    locations: Partial<Record<LocationId, LocationState>>
    town: TownStatus
    dungeon: DungeonStatus
    battle: Battle
    battleResult: BattleResult | null
    exploration: ExplorationState | null
    cache: Cache
}

let state: State = {
    player: {
        name: "Player",
        jobPrimary: "warrior",
        jobSecondary: null,
        power: 0,
        stamina: 10,
        staminaMax: 10,
    },
    jobs: {
        warrior: JobsService.createJob("warrior"),
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
        health: 10,
        energy: 20,
        stats: createEmptyStats(),
        effects: [],
        isTeamA: true,
        monsterId: null,
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
    inventory: [
        // {
        //     uid: "1",
        //     id: "axe",
        //     power: 10,
        //     rarity: 1,
        //     amount: 1,
        //     stats: [{ type: "attack", value: 10 }],
        // },
        // {
        //     uid: "1",
        //     id: "leather_clothing",
        //     power: 4,
        //     rarity: 2,
        //     amount: 1,
        //     stats: [
        //         { type: "defense", value: 3 },
        //         { type: "healing", value: 5 },
        //     ],
        // },
    ],
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
    battle: createBattle(),
    battleResult: null,
    abilities: {
        attack: { id: "attack", rank: 1 },
        bash: { id: "bash", rank: 1 },
        heal: { id: "heal", rank: 1 },
        magnum_break: { id: "magnum_break", rank: 1 },
        sword_mastery: { id: "sword_mastery", rank: 0 },
        axe_mastery: { id: "axe_mastery", rank: 0 },
        berserk: { id: "berserk", rank: 1 },
        poison: { id: "poison", rank: 1 },
    },
    loadout: {
        abilities: [],
        items: [null],
    },
    areas: {},
    locations: {},
    exploration: {
        areaId: "forest",
        tStart: 0,
        tEnd: 1000,
        result: {
            type: "combat",
            encounterId: "test_battle",
        },
    },
    cache: {
        lastItemIndex: 1,
        lastEntityIndex: 1,
        lastBattleId: 1,
    },
}

export function loadState(newState: State) {
    state = newState
}

export function getState() {
    return state
}

export function updateState(updatedState: Partial<State>) {
    state = {
        ...state,
        ...updatedState,
    }
}
