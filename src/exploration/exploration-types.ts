import { LocationId } from "../config/area-configs"
import { EntityId } from "../config/entity-configs"

export interface Entity {
    uid: number
    entityId: EntityId
}

export interface LocationState {
    id: LocationId
    progress: number
    entities: Entity[]
}
