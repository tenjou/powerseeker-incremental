import { SkillId } from "./skill-configs"

export type AspectId = "novice" | "warrior" | "cleric"

export interface AspectConfig {
    id: AspectId
    abilities: SkillId[]
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
