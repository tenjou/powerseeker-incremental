import { Brand } from "../types"

export type LocationId = Brand<string, "LocationId">
export type AreaId = "town" | "forest" | "desert"

export interface BattleLocationConfig {
    id: LocationId
    type: "battle"
}

export type LocationConfig = BattleLocationConfig

export interface AreaConfig {
    id: AreaId
    locations: LocationConfig[]
}

export const AreaConfigs: Record<AreaId, AreaConfig> = {
    town: {
        id: "town",
        locations: [],
    },
    forest: {
        id: "forest",
        locations: [],
    },
    desert: {
        id: "desert",
        locations: [],
    },
}
