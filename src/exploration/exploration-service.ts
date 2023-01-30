import { AreaId } from "../config/area-configs"
import { getState } from "../state"
import { emit } from "./../events"

export const ExplorationService = {
    addArea(areaId: AreaId) {
        const { areas } = getState()

        if (areas[areaId]) {
            console.error(`Already have area: ${areaId}`)
            return
        }

        emit("area-added", areaId)
    },
}

// import { LocationId } from "../config/location-config"
// import { emit } from "../events"
// import { getState } from "../state"
// import { ExplorationState } from "../world/world-types"
// import { updateState } from "./../state"

// export const ExplorationService = {
//     addLocation(locationId: LocationId) {
//         const { locations } = getState()

//         locations[locationId] = {
//             id: locationId,
//             progress: 0,
//             entities: [],
//         }

//         emit("location-added", locationId)
//     },

//     clear() {
//         updateState({
//             exploration: null,
//         })
//     },

//     remove(uid: number) {
//         const locationId: LocationId = "forest"
//         const location = ExplorationService.get(locationId)
//         if (!location) {
//             console.error(`Missing location: ${locationId}`)
//             return
//         }

//         const index = location.entities.findIndex((entry) => entry.uid === uid)
//         if (index === -1) {
//             console.error(`Could not find entity: ${uid}`)
//             return
//         }

//         location.entities.splice(index, 1)

//         emit("location-removed", uid)
//     },

//     get(locationId: LocationId) {
//         const { locations } = getState()

//         return locations[locationId] ?? null
//     },
// }
