export type EntityId = "fight"

export interface EntityConfig {
    id: EntityId
}

export const CardConfigs: Record<EntityId, EntityConfig> = {
    fight: {
        id: "fight",
    },
}
