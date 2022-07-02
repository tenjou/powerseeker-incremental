import { AbilityConfigs } from "../config/AbilityConfigs"
import { MonsterConfigs, MonsterId } from "../config/MonsterConfigs"
import { getState } from "../state"
import { Battler } from "./../types"
import { loadBattler } from "./components/battler-item"

let lastBattlerId = 0

export function addBattler(battler: Battler) {
    const { battle } = getState()

    battler.id = lastBattlerId++

    if (battler.isTeamA) {
        battle.battlersA.push(battler)
    } else {
        battle.battlersB.push(battler)
    }
}

export function loadBattlers() {
    const { battle } = getState()

    for (const battler of battle.battlersA) {
        loadBattler(battler)
    }
    for (const battler of battle.battlersB) {
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
