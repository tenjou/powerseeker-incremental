import { LocationConfig } from "./location-configs"

export type AreaId = "town" | "forest" | "desert"

export interface AreaConfig {
    id: AreaId
    locations: Record<string, LocationConfig>
}

export const AreaConfigs: Record<AreaId, AreaConfig> = {
    town: {
        id: "town",
        locations: {
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
        },
    },
    forest: {
        id: "forest",
        locations: {
            bar: {
                id: "bar",
                type: "battle",
                battleId: "test_battle",
                progressMax: 20,
            },
        },
    },
    desert: {
        id: "desert",
        locations: {},
    },
}
