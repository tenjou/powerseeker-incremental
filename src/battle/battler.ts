import { MonsterConfigs, MonsterId } from "../config/monster-configs"
import { getState } from "../state"
import { Battle, Battler } from "./battle-types"
import { loadBattler } from "./ui/battler-item"

export function loadBattlers() {
    const { battle } = getState()

    for (const battler of battle.battlers) {
        loadBattler(battler)
    }
}
