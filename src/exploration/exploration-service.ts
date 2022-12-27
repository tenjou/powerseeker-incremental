import { LocationId } from "../config/location-config"
import { emit } from "../events"
import { getState } from "../state"
import { ExplorationState } from "../world/world-types"
import { updateState } from "./../state"

export const ExplorationService = {
    addLocation(locationId: LocationId) {
        const { locations } = getState()

        if (locations[locationId]) {
            console.error(`Already have such location: ${locationId}`)
            return
        }

        locations[locationId] = {
            id: locationId,
            progress: 0,
            entities: [],
        }

        emit("location-added", locationId)
    },

    clear() {
        updateState({
            exploration: null,
        })
    },

    remove(uid: number) {
        const locationId: LocationId = "forest"
        const location = ExplorationService.get(locationId)
        if (!location) {
            console.error(`Missing location: ${locationId}`)
            return
        }

        const index = location.entities.findIndex((entry) => entry.uid === uid)
        if (index === -1) {
            console.error(`Could not find entity: ${uid}`)
            return
        }

        location.entities.splice(index, 1)

        emit("location-removed", uid)
    },

    get(locationId: LocationId) {
        const { locations } = getState()

        return locations[locationId] ?? null
    },
}
