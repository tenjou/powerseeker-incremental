import { LocationId } from "../config/location-config"
import { getState, updateState } from "../state"
import { goTo } from "../view"
import { emit } from "./../events"
import { ExplorationState } from "./world-types"

interface WorldCache {
    selectedLocationId: LocationId
}

const cache: WorldCache = {
    selectedLocationId: "town",
}

export const WorldService = {
    update(tCurrent: number) {
        const { exploration } = getState()

        if (!exploration) {
            return
        }

        const haveFinished = exploration.tEnd < tCurrent
        if (!haveFinished || exploration.result) {
            return
        }

        console.log("ended")

        const explorationNew: ExplorationState = {
            ...exploration,
            result: {
                type: "combat",
            },
        }

        updateState({
            exploration: explorationNew,
        })

        emit("exploration-ended", explorationNew)
    },

    goToLocation(locationId: LocationId) {
        if (cache.selectedLocationId === locationId) {
            return
        }

        cache.selectedLocationId = locationId

        goTo(`/world/${locationId}`)
        emit("location-updated", locationId)
    },

    exploreSelected() {
        const { exploration } = getState()

        const locationId = cache.selectedLocationId
        if (!locationId) {
            console.error("No location selected")
            return false
        }

        if (exploration) {
            console.error(`Already exploring: ${exploration.locationId}`)
            return false
        }

        const tStart = Date.now()
        const tEnd = tStart + 2000
        const explorationNew: ExplorationState = {
            locationId,
            tStart,
            tEnd,
            result: null,
        }

        updateState({
            exploration: explorationNew,
        })

        emit("exploration-started", explorationNew)

        return true
    },

    getSelectedLocationId() {
        return cache.selectedLocationId
    },

    isSelected(locationId: LocationId) {
        return cache.selectedLocationId === locationId
    },
}
