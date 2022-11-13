export type EntityId = "fight" | "treasure"

export interface EntityConfig {
    id: EntityId
}

export const CardConfigs: Record<EntityId, EntityConfig> = {
    fight: {
        id: "fight",
    },
    treasure: {
        id: "treasure",
    },
}
