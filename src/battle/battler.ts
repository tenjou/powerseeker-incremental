import { createProgressBar } from "../components/progress-bar"
import { MonsterConfigs, MonsterId } from "../config/MonsterConfigs"
import { getState } from "../state"
import { addChild, removeAllChildren } from "./../dom"
import { Battler } from "./../types"
import { updateProgessBar } from "./../components/progress-bar"

interface BattlerComponent {
    element: HTMLElement
    name: HTMLElement
    hpBar: HTMLElement
}

const maxSlots = 4
const components: BattlerComponent[] = []

export function updateBattler(battler: Battler) {
    const component = components[battler.id]

    updateProgessBar(component.hpBar, battler.hp, battler.hpMax)
}

function selectBattler(battler: Battler) {
    console.log("select", battler)
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

function loadBattler(battler: Battler) {
    const element = document.createElement("battler")
    element.onclick = () => {
        selectBattler(battler)
    }

    const name = document.createElement("battler-name")
    name.innerText = battler.name
    element.appendChild(name)

    const hpBar = createProgressBar()
    element.appendChild(hpBar)

    if (battler.isTeamA) {
        addChild("battle-column-a", element)
    } else {
        addChild("battle-column-b", element)
    }

    battler.id = components.length

    components.push({
        element,
        name,
        hpBar,
    })

    updateBattler(battler)
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

export function unloadBattlers() {
    removeAllChildren("battle-column-a")
    removeAllChildren("battle-column-b")
    components.length = 0
}
