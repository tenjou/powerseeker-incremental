import { MonsterConfigs, MonsterId } from "../config/MonsterConfigs"
import { getState } from "../state"
import { Battler } from "./../types"
import { loadBattler } from "./battler-item"

export function addBattler(battler: Battler) {
    const { battle } = getState()

    battler.id = battle.battlers.push(battler) - 1

    if (battler.isTeamA) {
        battle.battlersA.push(battler.id)
    } else {
        battle.battlersB.push(battler.id)
    }
}

export function loadBattlers() {
    const { battle } = getState()

    for (const battler of battle.battlers) {
        loadBattler(battler)
    }
}

export function createMonsterBattler(monsterId: MonsterId): Battler {
    const monsterConfig = MonsterConfigs[monsterId]

    return {
        id: 0,
        name: monsterConfig.name,
        level: monsterConfig.level,
        hp: monsterConfig.hp,
        hpMax: monsterConfig.hp,
        power: monsterConfig.power,
        defense: monsterConfig.defense,
        speed: monsterConfig.speed,
        isTeamA: false,
        isAI: true,
    }
}
