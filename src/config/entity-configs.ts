export type EntityId = "fight" | "treasure"

export interface BasicEntityConfig {}

export interface FightEntityConfig {
    type: "fight"
}

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
