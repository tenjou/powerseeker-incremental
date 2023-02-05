import { Brand } from "../types"

export type LocationId = Brand<string, "LocationId">
export type AreaId = "town" | "forest" | "desert"

export interface BattleLocationConfig {
    id: string
    type: "battle"
    progressMax: number
}

export type LocationConfig = BattleLocationConfig

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
                progressMax: 10,
            },
            foo2: {
                id: "foo2",
                type: "battle",
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
                progressMax: 20,
            },
        },
    },
    desert: {
        id: "desert",
        locations: {},
    },
}

export const LocationConfigs: Record<LocationId, LocationConfig> = {}

for (let areaId in AreaConfigs) {
    const area = AreaConfigs[areaId as AreaId]
    for (let locationId in area.locations) {
        const location = area.locations[locationId]
        LocationConfigs[location.id as LocationId] = location
    }
}
