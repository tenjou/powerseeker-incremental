export type LocationId = "forest" | "desert"

export interface LocationConfig {
    id: LocationId
    level: number
}

export const LocationConfigs: Record<LocationId, LocationConfig> = {
    forest: {
        id: "forest",
        level: 1,
    },
    desert: {
        id: "desert",
        level: 2,
    },
}
