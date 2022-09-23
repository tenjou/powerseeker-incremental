import { AbilityId } from "./ability-configs"

export type JobId = "warrior" | "thief" | "cleric" | "elementalist"

export interface JobConfig {
    id: string
    abilities: AbilityId[]
}

export const JobConfigs: Record<JobId, JobConfig> = {
    cleric: {
        id: "cleric",
        abilities: [],
    },
    elementalist: {
        id: "elementalist",
        abilities: [],
    },
    thief: {
        id: "thief",
        abilities: [],
    },
    warrior: {
        id: "warrior",
        abilities: [],
    },
}
