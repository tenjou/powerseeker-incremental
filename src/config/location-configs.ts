import { Brand } from "../types"
import { BattleId } from "./battle-configs"
import { ItemId } from "./item-configs"

export type LocationId = Brand<string, "LocationId">

interface LootEntry {
    itemId: ItemId
    chance: number
    min: number
    max: number
}

export interface BasicLocationConfig {
    id: LocationId
    level: number
    progressMax: number
    loot: LootEntry[]
    unlocks: LocationId[]
}

export interface BattleLocationConfig extends BasicLocationConfig {
    type: "battle"
    battleId: BattleId
}

export interface BossLocationConfig extends BasicLocationConfig {
    type: "boss"
    battleId: BattleId
    cooldown: number
}

export interface GatheringLocationConfig extends BasicLocationConfig {
    type: "gathering"
    cooldown: number
}

export type LocationConfig = BattleLocationConfig | BossLocationConfig | GatheringLocationConfig

export const LocationConfigs: Record<LocationId, LocationConfig> = {
    foo: {
        id: "foo",
        type: "battle",
        level: 1,
        battleId: "test_battle",
        progressMax: 1,
        loot: [
            {
                itemId: "health_potion",
                chance: 100,
                min: 1,
                max: 3,
            },
        ],
        unlocks: ["foo2"],
    },
    copper_mine: {
        id: "copper_mine",
        type: "gathering",
        level: 2,
        cooldown: 10000,
        progressMax: 4,
        loot: [
            {
                itemId: "copper_ore",
                chance: 100,
                min: 1,
                max: 3,
            },
        ],
        unlocks: [],
    },
    test_boss: {
        id: "test_boss",
        type: "boss",
        level: 1,
        battleId: "test_battle",
        cooldown: 10000,
        progressMax: 1,
        loot: [
            {
                itemId: "copper_ore",
                chance: 100,
                min: 1,
                max: 3,
            },
        ],
        unlocks: [],
    },
    foo2: {
        id: "foo2",
        type: "battle",
        level: 1,
        battleId: "test_battle",
        progressMax: 1,
        loot: [],
        unlocks: [],
    },
    bar: {
        id: "bar",
        type: "battle",
        level: 1,
        battleId: "test_battle",
        progressMax: 20,
        loot: [],
        unlocks: [],
    },
}
