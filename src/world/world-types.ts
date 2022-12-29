import { BattleId } from "../config/battle-configs"
import { LocationId } from "../config/location-config"

interface ExplorationResultCombat {
    type: "combat"
    encounterId: BattleId
}

type ExplorationResult = ExplorationResultCombat

export interface ExplorationState {
    locationId: LocationId
    result: ExplorationResult | null
    tStart: number
    tEnd: number
}
