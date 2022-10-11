import { MonsterId } from "./monster-configs"

export type EncounterId = "test_battle"

export interface EncounterConfig {
    id: EncounterId
    monsters: MonsterId[]
}

export const EncounterConfigs: Record<string, EncounterConfig> = {
    test_battle: {
        id: "test_battle",
        monsters: ["boar"],
    },
}
