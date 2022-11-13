import { LocationId } from "../config/location-config"
import { Entity } from "./../entities/entity-types"

export interface LocationState {
    id: LocationId
    progress: number
    entities: Entity[]
}
