import { StartBattleAction } from "./config/CardConfigs"
import { MonsterConfigs, MonsterId } from "./config/MonsterConfigs"
import { addChild, setShow, setText } from "./dom"
import { getState } from "./state"
import { Battler } from "./types"
import { randomItem } from "./utils"
import { updatePlayerStatus } from "./status"

let lastBattleId = 1
let lastBattlerId = 1

export function startBattle(cardId: number, action: StartBattleAction) {
    const { battle, battler } = getState()

    battle.id = lastBattleId++
    battle.cardId = cardId

    addBattler(battler)

    for (const monsterId of action.monsters) {
        const monsterBattler = createMonsterBattler(monsterId)
        addBattler(monsterBattler)
    }

    setShow("area-town", false)

    loadBattle()
    setShow("area-battle", true)
}

function endBattle() {
    const { battle, battler } = getState()

    battle.id = -1
    battle.cardId - 1
    battle.battlers.length = 0
    battle.battlersA.length = 0
    battle.battlersB.length = 0

    battler.tNextAttack = 0

    setShow("area-battle", false)

    updatePlayerStatus()
    setShow("area-town", true)
}

function addBattler(battler: Battler) {
    const { battle } = getState()

    battler.id = lastBattlerId++

    calcNextTurn(battler)

    battle.battlers.push(battler)
    if (battler.isTeamA) {
        battle.battlersA.push(battler)
    } else {
        battle.battlersB.push(battler)
    }
}

function loadBattle() {
    const { battle } = getState()

    for (const battler of battle.battlers) {
        loadBattler(battler)
    }
}

function loadBattler(battler: Battler) {
    const battlerElement = document.createElement("battler")
    battlerElement.id = `battler-${battler.id}`

    const battlerNameElement = document.createElement("battler-name")
    battlerNameElement.innerText = battler.name
    battlerElement.appendChild(battlerNameElement)

    const battlerHpElement = document.createElement("battler-hp")
    battlerHpElement.id = `${battlerElement.id}-hp`
    battlerHpElement.innerText = `${battler.hp}/${battler.hpMax}`
    battlerElement.appendChild(battlerHpElement)

    if (battler.isTeamA) {
        addChild("battle-column-a", battlerElement)
    } else {
        addChild("battle-column-b", battlerElement)
    }
}

function createMonsterBattler(monsterId: MonsterId): Battler {
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
        tNextAttack: 0,
    }
}

function calcNextTurn(battler: Battler) {
    const { battle } = getState()

    const offset = battler.tNextAttack > 0 ? battle.tBattle - battler.tNextAttack : 0

    battler.tNextAttack = battle.tBattle - offset + 1500 - battler.speed * 100
}

export function updateBattle(tDelta: number) {
    const { battle } = getState()

    if (battle.id === -1) {
        return
    }

    battle.tBattle += tDelta

    for (const battler of battle.battlers) {
        if (battler.tNextAttack <= battle.tBattle) {
            handleAttack(battler)
        }
    }
}

function handleAttack(battler: Battler) {
    const { battle } = getState()

    const enemyBattlers = battler.isTeamA ? battle.battlersB : battle.battlersA
    const target = randomItem(enemyBattlers)

    target.hp -= battler.power - target.defense
    if (target.hp <= 0) {
        target.hp = 0

        if (isTeamDead(enemyBattlers)) {
            endBattle()
            return
        }
    }

    calcNextTurn(battler)

    updateBattler(target)
}

function isTeamDead(battlers: Battler[]) {
    for (const battler of battlers) {
        if (battler.hp > 0) {
            return false
        }
    }

    return true
}

function updateBattler(battler: Battler) {
    setText(`battler-${battler.id}-hp`, `${battler.hp}/${battler.hpMax}`)
}
