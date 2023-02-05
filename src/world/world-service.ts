import { AreaConfigs, AreaId, LocationId } from "../config/area-configs"
import { getState, updateState } from "../state"
import { goTo } from "../view"
import { BattleService } from "./../battle/battle"
import { emit } from "./../events"
import { AreaState, ExplorationState, LocationState } from "./world-types"
import { LocationConfigs } from "./../config/area-configs"

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

    interactExplored() {
        const { exploration } = getState()

        if (!exploration || !exploration.result) {
            console.error("Nothing has been explored")
            return false
        }

        BattleService.start(exploration.result.encounterId)

        console.log("interactExplored", exploration.result)
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

    addLocation(areaId: AreaId, locationId: LocationId) {
        const { areas, locations } = getState()

        const areaConfig = AreaConfigs[areaId]
        if (!areaConfig) {
            throw new Error(`No area config for ${areaId}`)
        }

        let area = areas[areaId]
        if (!area) {
            area = createArea(areaId)
            areas[areaId] = area
        }

        const locationConfig = areaConfig.locations[locationId]
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
