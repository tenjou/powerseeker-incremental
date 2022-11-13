import { EntityId } from "../config/entity-configs"
import { LocationId } from "../config/location-config"

export interface Entity {
    uid: number
    entityId: EntityId
}

export interface LocationState {
    id: LocationId
    progress: number
    entities: Entity[]
}
