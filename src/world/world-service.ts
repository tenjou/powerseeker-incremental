import { BattleService } from "../battle/battle-service"
import { AreaConfigs, AreaId } from "../config/area-configs"
import { LocationId, LocationConfigs } from "../config/location-configs"
import { getState, updateState } from "../state"
import { goTo } from "../view"
import { emit } from "./../events"
import { AreaState, ExplorationState, LocationState } from "./world-types"

interface WorldCache {
    selectedAreaId: AreaId
}

const cache: WorldCache = {
    selectedAreaId: "town",
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

        const explorationNew: ExplorationState = {
            ...exploration,
            result: {
                type: "combat",
                encounterId: "test_battle",
            },
        }

        updateState({
            exploration: explorationNew,
        })

        emit("exploration-ended", explorationNew)
    },

    goToArea(areaId: AreaId) {
        if (cache.selectedAreaId === areaId) {
            return
        }

        cache.selectedAreaId = areaId

        goTo(`/world/${areaId}`)
        emit("area-updated", areaId)
    },

    exploreSelected() {
        const { exploration } = getState()

        const areaId = cache.selectedAreaId
        if (!areaId) {
            console.error("No location selected")
            return false
        }

        if (exploration) {
            console.error(`Already exploring: ${exploration.areaId}`)
            return false
        }

        const tStart = Date.now()
        const tEnd = tStart + 2000
        const explorationNew: ExplorationState = {
            areaId,
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

    interact(locationId: LocationId) {
        const { locations } = getState()

        const location = locations[locationId]
        if (!location) {
            throw new Error(`No location for ${locationId}`)
        }

        const locationConfig = LocationConfigs[locationId]
        switch (locationConfig.type) {
            case "battle":
                BattleService.startFromLocation(locationId)
                break

            default:
                throw new Error(`Unknown location type: ${locationConfig.type}`)
        }
    },

    progressLocation(locationId: LocationId, amount: number) {
        const { locations } = getState()

        const location = locations[locationId]
        if (!location) {
            throw new Error(`No location for ${locationId}`)
        }

        const locationConfig = LocationConfigs[locationId]

        if (location.progress === locationConfig.progressMax) {
            return
        }

        location.progress += amount
        if (location.progress > locationConfig.progressMax) {
            location.progress = locationConfig.progressMax
        }

        emit("location-updated", locationId)
    },

    addLocation(locationId: LocationId) {
        const { locations } = getState()

        if (locations[locationId]) {
            throw new Error(`Location already exists: ${locationId}`)
        }

        const locationConfig = LocationConfigs[locationId]
        if (!locationConfig) {
            throw new Error(`No location config for ${locationId}`)
        }

        let location = locations[locationId]
        if (!location) {
            location = createLocation(locationId)
            locations[locationId] = location
        }

        return location
    },

    getSelectedArea() {
        const { areas } = getState()

        const areaId = cache.selectedAreaId

        let area = areas[areaId]
        if (!area) {
            area = createArea(areaId)
            areas[areaId] = area
        }

        return area
    },

    getSelectedAreaId() {
        return cache.selectedAreaId
    },

    isSelected(areaId: AreaId) {
        return cache.selectedAreaId === areaId
    },
}

const createArea = (areaId: AreaId): AreaState => {
    return {
        id: areaId,
    }
}

const createLocation = (locationId: LocationId): LocationState => {
    return {
        id: locationId,
        progress: 0,
    }
}
