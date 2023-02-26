import { Aspect } from "./aspects/aspect-types"
import { createBattle } from "./battle/battle-service"
import { Battle, Battler, BattleResult } from "./battle/battle-types"
import { createEmptyStats } from "./character/status"
import { SkillId } from "./config/skill-configs"
import { AreaId } from "./config/area-configs"
import { AspectId } from "./config/aspect-configs"
import { EquipmentSlot, ItemId } from "./config/item-configs"
import { LocationId } from "./config/location-configs"
import { CurrencyType } from "./currencies/currency-types"
import { Item } from "./inventory/item-types"
import { LoadoutSkill } from "./loadout/loadout-types"
import { AreaState, ExplorationState, LocationState } from "./world/world-types"
import { Skill } from "./skills/skills-types"

interface PlayerStatus {
    name: string
    aspectId: AspectId
    sp: number
    power: number
    stamina: number
    staminaMax: number
}

interface Cache {
    lastItemIndex: number
    lastEntityIndex: number
    lastBattleId: number
}

interface State {
    player: PlayerStatus
    aspects: Partial<Record<AspectId, Aspect>>
    currencies: Record<CurrencyType, number>
    equipment: Record<EquipmentSlot, Item | null>
    battler: Battler
    inventory: Item[]
    skills: Record<SkillId, Skill>
    loadout: {
        abilities: (LoadoutSkill | null)[]
        items: (ItemId | null)[]
    }
    areas: Partial<Record<AreaId, AreaState>>
    locations: Partial<Record<LocationId, LocationState>>
    battle: Battle
    battleResult: BattleResult | null
    exploration: ExplorationState | null
    cache: Cache
}

let state: State = {
    player: {
        name: "Tenjou",
        aspectId: "novice",
        sp: 167,
        power: 0,
        stamina: 10,
        staminaMax: 10,
    },
    aspects: {},
    currencies: {
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
        health: 1,
        mana: 1,
        stats: createEmptyStats(),
        effects: [],
        isTeamA: true,
        monsterId: null,
    },
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
    battle: createBattle(),
    battleResult: null,
    skills: {
        fire_attack: { id: "fire_attack", rank: 1 },
        // bash: { id: "bash", rank: 1 },
        // heal: { id: "heal", rank: 1 },
        // magnum_break: { id: "magnum_break", rank: 1 },
        // sword_mastery: { id: "sword_mastery", rank: 0 },
        // axe_mastery: { id: "axe_mastery", rank: 0 },
        // berserk: { id: "berserk", rank: 1 },
        // poison: { id: "poison", rank: 1 },
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
