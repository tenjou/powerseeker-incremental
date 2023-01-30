import { AreaId } from "../config/area-configs"
import { getState, updateState } from "../state"
import { goTo } from "../view"
import { BattleService } from "./../battle/battle"
import { emit } from "./../events"
import { ExplorationState } from "./world-types"

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

    getSelectedAreaId() {
        return cache.selectedAreaId
    },

    isSelected(areaId: AreaId) {
        return cache.selectedAreaId === areaId
    },
}
