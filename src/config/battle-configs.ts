import { MonsterId } from "./monster-configs"

export type BattleId = "test_battle"

export interface BattleConfig {
    id: BattleId
    monsters: MonsterId[]
}

export const BattleConfigs: Record<BattleId, BattleConfig> = {
    test_battle: {
        id: "test_battle",
        monsters: ["boar"],
    },
}
