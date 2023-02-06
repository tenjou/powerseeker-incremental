import { Brand } from "../types"
import { BattleId } from "./battle-configs"

export type LocationId = Brand<string, "LocationId">

export interface BattleLocationConfig {
    id: LocationId
    type: "battle"
    battleId: BattleId
    progressMax: number
}

export type LocationConfig = BattleLocationConfig

export const LocationConfigs: Record<LocationId, LocationConfig> = {
    foo: {
        id: "foo",
        type: "battle",
        battleId: "test_battle",
        progressMax: 10,
    },
    foo2: {
        id: "foo2",
        type: "battle",
        battleId: "test_battle",
        progressMax: 4,
    },
    bar: {
        id: "bar",
        type: "battle",
        battleId: "test_battle",
        progressMax: 20,
    },
}
