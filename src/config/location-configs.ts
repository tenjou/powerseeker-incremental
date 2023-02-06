import { Brand } from "../types"
import { AreaConfigs, AreaId } from "./area-configs"
import { BattleId } from "./battle-configs"

export type LocationId = Brand<string, "LocationId">

export interface BattleLocationConfig {
    id: string
    type: "battle"
    battleId: BattleId
    progressMax: number
}

export type LocationConfig = BattleLocationConfig

export const LocationConfigs: Record<LocationId, LocationConfig> = {}

for (let areaId in AreaConfigs) {
    const area = AreaConfigs[areaId as AreaId]
    for (let locationId in area.locations) {
        const location = area.locations[locationId]
        LocationConfigs[location.id as LocationId] = location
    }
}
