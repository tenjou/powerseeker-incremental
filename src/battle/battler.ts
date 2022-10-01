import { MonsterConfigs, MonsterId } from "../config/monster-configs"
import { getState } from "../state"
import { Battler } from "./battle-types"
import { loadBattler } from "./ui/battler-item"

export function addBattler(battler: Battler) {
    const { battle } = getState()

    battler.id = battle.battlers.push(battler) - 1

    battle.battlersView.push({
        health: battler.health,
        healthMax: battler.stats.health,
        energy: battler.energy,
        energyMax: battler.stats.energy,
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
        health: 1,
        energy: 1,
        stats: {
            health: monsterConfig.health,
            energy: monsterConfig.energy,
            accuracy: 0,
            attack: monsterConfig.attack,
            critical: 0,
            defense: monsterConfig.defense,
            evasion: 0,
            healing: 0,
            speed: monsterConfig.speed,
        },
        effects: [],
        isTeamA: false,
        monsterId,
    }
}
