import { AreaId } from "../config/area-configs"
import { BattleId } from "../config/battle-configs"
import { LocationId } from "../config/location-configs"

interface ExplorationResultCombat {
    type: "combat"
    encounterId: BattleId
}

type ExplorationResult = ExplorationResultCombat

export interface ExplorationState {
    areaId: AreaId
    result: ExplorationResult | null
    tStart: number
    tEnd: number
}

export interface AreaState {
    id: AreaId
}

export interface LocationState {
    id: LocationId
    progress: number
    startedAt: number
    completedAt: number
}
