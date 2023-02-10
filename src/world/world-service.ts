import { BattleService } from "../battle/battle-service"
import { AreaId } from "../config/area-configs"
import { LocationConfig, LocationConfigs, LocationId } from "../config/location-configs"
import { LootService } from "../inventory/loot-service"
import { getState, updateState } from "../state"
import { goTo } from "../view"
import { emit } from "./../events"
import { AreaState, ExplorationState, LocationState } from "./world-types"
import { InventoryService } from "./../inventory/inventory"

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

            case "resource": {
                if (WorldService.progressLocation(locationId, 3)) {
                    const item = LootService.generateItem(locationConfig.dropItemId, 1, 0)
                    InventoryService.add(item)
                }
                break
            }
        }
    },

    updateLocation(locationId: LocationId, locationConfig: LocationConfig, updateLocation: boolean) {
        const { locations } = getState()

        const location = locations[locationId]
        if (!location) {
            throw new Error(`No location for ${locationId}`)
        }

        if (locationConfig.type === "resource" && location.progress > 0) {
            const tElapsedFromStart = Date.now() - location.startedAt
            if (tElapsedFromStart >= locationConfig.cooldown) {
                location.progress = 0
            }
        }

        if (updateLocation) {
            emit("location-updated", locationId)
        }

        return location
    },

    progressLocation(locationId: LocationId, amount: number) {
        const locationConfig = LocationConfigs[locationId]
        const location = WorldService.updateLocation(locationId, locationConfig, false)

        if (location.progress >= locationConfig.progressMax) {
            return false
        }

        if (location.progress === 0) {
            location.startedAt = Date.now()
        }

        location.progress += amount
        if (location.progress >= locationConfig.progressMax) {
            location.progress = locationConfig.progressMax
            location.completedAt = Date.now()

            for (const unlockedLocationId of locationConfig.unlocks) {
                this.addLocation(unlockedLocationId)
                emit("location-added", unlockedLocationId)
            }
        }

        emit("location-updated", locationId)

        return true
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
        startedAt: 0,
        completedAt: 0,
    }
}
