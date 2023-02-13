import { Brand } from "../types"
import { BattleId } from "./battle-configs"
import { ItemId } from "./item-configs"

export type LocationId = Brand<string, "LocationId">

export interface BasicLocationConfig {
    id: LocationId
    progressMax: number
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

export interface ResourceLocationConfig extends BasicLocationConfig {
    type: "resource"
    dropItemId: ItemId
    cooldown: number
}

export type LocationConfig = BattleLocationConfig | BossLocationConfig | ResourceLocationConfig

export const LocationConfigs: Record<LocationId, LocationConfig> = {
    foo: {
        id: "foo",
        type: "battle",
        battleId: "test_battle",
        progressMax: 1,
        unlocks: ["foo2"],
    },
    copper_mine: {
        id: "copper_mine",
        type: "resource",
        dropItemId: "copper_ore",
        cooldown: 3000,
        progressMax: 4,
        unlocks: [],
    },
    test_boss: {
        id: "test_boss",
        type: "boss",
        battleId: "test_battle",
        cooldown: 10000,
        progressMax: 1,
        unlocks: [],
    },
    foo2: {
        id: "foo2",
        type: "battle",
        battleId: "test_battle",
        progressMax: 1,
        unlocks: [],
    },
    bar: {
        id: "bar",
        type: "battle",
        battleId: "test_battle",
        progressMax: 20,
        unlocks: [],
    },
}
