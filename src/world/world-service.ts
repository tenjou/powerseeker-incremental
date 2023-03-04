import { BattleService } from "../battle/battle-service"
import { AreaId } from "../config/area-configs"
import { LocationConfig, LocationConfigs, LocationId } from "../config/location-configs"
import { LootService } from "../inventory/loot-service"
import { getState, updateState } from "../state"
import { roll } from "../utils"
import { goTo } from "../view"
import { emit } from "./../events"
import { InventoryService } from "../inventory/inventory-service"
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
            case "boss": {
                if (WorldService.canInteract(locationId)) {
                    BattleService.startFromLocation(locationId)
                }
                break
            }

            case "gathering": {
                if (WorldService.canInteract(locationId)) {
                    WorldService.progressLocation(locationId, 2)
                }
                break
            }
        }
    },

    canInteract(locationId: LocationId) {
        const { locations } = getState()

        const location = locations[locationId]
        if (!location) {
            throw new Error(`No location for ${locationId}`)
        }

        const locationConfig = LocationConfigs[locationId]

        return location.progress < locationConfig.progressMax || location.resetAt === 0
    },

    progressLocation(locationId: LocationId, amount: number, updatedAt: number = Date.now()) {
        if (!this.canInteract(locationId)) {
            return
        }

        const { locations } = getState()

        const location = locations[locationId]
        const locationCfg = LocationConfigs[locationId]

        if (location.progress >= locationCfg.progressMax) {
            return
        }

        if (location.startedAt === 0) {
            location.startedAt = updatedAt
        }

        location.progress += amount

        if (locationCfg.type === "gathering") {
            rewardFromLocation(locationCfg)
        }

        if (location.progress >= locationCfg.progressMax) {
            location.progress = locationCfg.progressMax
            location.completedAt = updatedAt

            if (locationCfg.type !== "gathering") {
                rewardFromLocation(locationCfg)
            }

            for (const unlockedLocationId of locationCfg.unlocks) {
                this.addLocation(unlockedLocationId)
                emit("location-added", unlockedLocationId)
            }
        }

        if (location.resetAt === 0 && (locationCfg.type === "gathering" || locationCfg.type === "boss")) {
            location.resetAt = updatedAt + locationCfg.cooldown
            cache.locationsReseting.push(location)
            sortLocationsReseting()
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

        const location = createLocation(locationId)
        locations[locationId] = location

        return location
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

const rewardFromLocation = (locationCfg: LocationConfig) => {
    for (const reward of locationCfg.loot) {
        if (!roll(reward.chance)) {
            continue
        }

        const amount = randomNumber(reward.min, reward.max)
        const item = LootService.generateItem(reward.itemId, amount, 0)
        InventoryService.add(item)
    }
}
