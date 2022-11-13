import { EntityId } from "./entity-configs"

export type LocationId = "town" | "forest" | "desert"

export interface LocationEntityConfig {
    id: EntityId
    chance: number
}

export interface LocationConfig {
    id: LocationId
    level: number
    entities: LocationEntityConfig[]
}

export const LocationConfigs: Record<LocationId, LocationConfig> = {
    town: {
        id: "town",
        entities: [],
        level: 1,
    },
    forest: {
        id: "forest",
        entities: [
            {
                id: "fight",
                chance: 100,
            },
            {
                id: "treasure",
                chance: 50,
            },
        ],
        level: 1,
    },
    desert: {
        id: "desert",
        entities: [],
        level: 2,
    },
}
