import { AbilityId } from "./ability-configs"

export type AspectId = "novice" | "warrior" | "cleric"

export interface AspectConfig {
    id: AspectId
    abilities: AbilityId[]
}

export const AspectConfigs: Record<AspectId, AspectConfig> = {
    novice: {
        id: "novice",
        abilities: [],
    },
    warrior: {
        id: "warrior",
        abilities: [],
    },
    cleric: {
        id: "cleric",
        abilities: [],
    },
}
