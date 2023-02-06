import { LocationConfig, LocationId } from "./location-configs"

export type AreaId = "town" | "forest" | "desert"

export interface AreaConfig {
    id: AreaId
    locations: LocationId[]
}

export const AreaConfigs: Record<AreaId, AreaConfig> = {
    town: {
        id: "town",
        locations: ["foo", "foo2"],
    },
    forest: {
        id: "forest",
        locations: ["bar"],
    },
    desert: {
        id: "desert",
        locations: [],
    },
}
