import { BattleService } from "../battle/battle-service"
import { AreaId } from "../config/area-configs"
import { LocationConfigs, LocationId } from "../config/location-configs"
import { LootService } from "../inventory/loot-service"
import { getState, updateState } from "../state"
import { roll } from "../utils"
import { goTo } from "../view"
import { emit } from "./../events"
import { InventoryService } from "./../inventory/inventory"
import "./ui/location-popup"
import "./ui/location-status"
import { AreaState, ExplorationState, LocationState } from "./world-types"
import { randomNumber } from "./../utils"

interface WorldCache {
    selectedAreaId: AreaId
    locationsReseting: LocationState[]
    locationsResetingRemove: LocationState[]
}

const cache: WorldCache = {
    selectedAreaId: "town",
    locationsReseting: [],
    locationsResetingRemove: [],
}

export const WorldService = {
    load() {
        const { locations } = getState()

        for (const locationId in locations) {
            const location = locations[locationId as LocationId]
            if (location.resetAt > 0) {
                cache.locationsReseting.push(location)
            }
        }

        sortLocationsReseting()
    },

    update(tNow: number) {
        for (const locationState of cache.locationsReseting) {
            if (locationState.resetAt > tNow) {
                break
            }

            locationState.progress = 0
            locationState.startedAt = 0
            locationState.resetAt = 0
            emit("location-updated", locationState.id)

            cache.locationsResetingRemove.push(locationState)
        }

        if (cache.locationsResetingRemove.length > 0) {
            for (const locationState of cache.locationsResetingRemove) {
                const index = cache.locationsReseting.indexOf(locationState)
                if (index >= 0) {
                    cache.locationsReseting.splice(index, 1)
                }
            }

            cache.locationsResetingRemove = []
        }
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
        const { locations, battleResult } = getState()

        if (battleResult) {
            throw new Error("Cannot interact while battle result is shown")
        }

        const location = locations[locationId]
        if (!location) {
            throw new Error(`No location for ${locationId}`)
        }

        const locationConfig = LocationConfigs[locationId]

        switch (locationConfig.type) {
            case "battle":
                BattleService.startFromLocation(locationId)
                break

            case "boss": {
                if (WorldService.progressLocation(locationId, 1)) {
                    BattleService.startFromLocation(locationId)
                }
                break
            }

            case "resource": {
                if (WorldService.progressLocation(locationId, 3)) {
                    for (const reward of locationConfig.loot) {
                        if (!roll(reward.chance)) {
                            continue
                        }

                        const amount = randomNumber(reward.min, reward.max)
                        const item = LootService.generateItem(reward.itemId, amount, 0)
                        InventoryService.add(item)
                    }
                }
                break
            }
        }
    },

    progressLocation(locationId: LocationId, amount: number, updatedAt: number = Date.now()) {
        const { locations } = getState()

        const location = locations[locationId]
        if (!location) {
            throw new Error(`No location for ${locationId}`)
        }

        const locationConfig = LocationConfigs[locationId]

        if (location.progress >= locationConfig.progressMax) {
            return false
        }

        if (location.startedAt === 0) {
            location.startedAt = updatedAt
        }

        location.progress += amount

        if (location.progress >= locationConfig.progressMax) {
            location.progress = locationConfig.progressMax
            location.completedAt = updatedAt

            for (const unlockedLocationId of locationConfig.unlocks) {
                this.addLocation(unlockedLocationId)
                emit("location-added", unlockedLocationId)
            }
        }

        if (location.resetAt === 0 && (locationConfig.type === "resource" || locationConfig.type === "boss")) {
            location.resetAt = updatedAt + locationConfig.cooldown
            cache.locationsReseting.push(location)
            sortLocationsReseting()
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

        const location = createLocation(locationId)
        locations[locationId] = location

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
        resetAt: 0,
    }
}

const sortLocationsReseting = () => {
    cache.locationsReseting.sort((a, b) => a.resetAt - b.resetAt)
}
