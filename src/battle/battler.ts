import { MonsterConfigs, MonsterId } from "../config/monster-configs"
import { getState } from "../state"
import { Battler } from "./battle-types"
import { loadBattler } from "./battler-item"

export function addBattler(battler: Battler) {
    const { battle } = getState()

    battler.id = battle.battlers.push(battler) - 1

    battle.battlersView.push({
        hp: battler.hp,
        hpMax: battler.hpMax,
    })

    if (battler.isTeamA) {
        battle.teamA.push(battler.id)
    } else {
        battle.teamB.push(battler.id)
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
        level: monsterConfig.level,
        name: monsterConfig.name,
        hp: monsterConfig.hp,
        hpMax: monsterConfig.hp,
        stats: {
            accuracy: 0,
            attack: monsterConfig.attack,
            critical: 0,
            defense: monsterConfig.defense,
            evasion: 0,
            healing: 0,
            speed: monsterConfig.speed,
        },
        isTeamA: false,
        isAI: true,
    }
}
