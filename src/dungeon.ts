import { DungeonConfigs } from "./config/DungeonConfigs"
import { removeAllChildren, setOnClick, setShow, setText } from "./dom"
import { getState } from "./state"
import { addCard, loadCards, removeCard } from "./cards"
import { Card } from "./types"

export function setupDungeonSystem() {
    setOnClick("dungeon-exit", exitDungeon)
}

export function loadDungeonStage() {
    const { dungeon } = getState()

    const dungeonConfig = DungeonConfigs[dungeon.id]
    const dungeonStageConfig = dungeonConfig.stages[dungeon.stage]

    loadCards(dungeon.cards, true)

    // for (const cardId of dungeonStageConfig.cards) {
    //     addCard(cardId)
    // }

    updateDungeonStatus()

    setShow("area-dungeon", true)
}

function updateDungeonStatus() {
    const { dungeon } = getState()

    const dungeonConfig = DungeonConfigs[dungeon.id]
    const dungeonStageConfig = dungeonConfig.stages[dungeon.stage]
    const progress = Math.min(dungeonStageConfig.progressRequired, dungeon.progress)

    setText("dungeon-name", dungeonConfig.name)
    setText("dungeon-stage", `Stage: ${dungeon.stage + 1}/${dungeonConfig.stages.length}`)
    setText("dungeon-progress", `Progress: ${progress}/${dungeonStageConfig.progressRequired}`)
}

export function enterDungeon(dungeonId: string, cardId: number) {
    const { dungeon } = getState()

    const dungeonConfig = DungeonConfigs[dungeonId]
    if (!dungeonConfig) {
        console.error(`Could not find dungeon config: ${dungeonId}`)
        return
    }

    dungeon.id = dungeonId
    dungeon.parentCardId = cardId
    dungeon.progress = 0
    dungeon.stage = 0

    setShow("area-town", false)

    setShow("area-dungeon", true)
    loadDungeonStage()
}

export function advanceDungeonStage() {
    const { dungeon } = getState()

    dungeon.stage++
    dungeon.progress = 0
    dungeon.stageCompleted = false
    dungeon.cards.length = 0

    removeAllChildren("dungeon-cards")
    loadDungeonStage()
}

export function handleDungeonCardClick(card: Card) {
    const { dungeon } = getState()

    dungeon.progress++

    const dungeonConfig = DungeonConfigs[dungeon.id]
    const dungeonStageConfig = dungeonConfig.stages[dungeon.stage]

    const isProgressDone = dungeonStageConfig.progressRequired <= dungeon.progress
    const isLastStage = dungeonConfig.stages.length <= dungeon.stage + 1

    if (isProgressDone) {
        if (!dungeon.stageCompleted && !isLastStage) {
            dungeon.stageCompleted = true
            addCard("door")
        }

        if (!dungeon.reachedEnd && isLastStage) {
            dungeon.reachedEnd = true
            addCard(dungeonConfig.reward)
        }
    }

    updateDungeonStatus()
}

function exitDungeon() {
    const state = getState()

    const parentToRemove = state.dungeon.reachedEnd ? state.dungeon.parentCardId : 0

    state.dungeon = {
        id: "",
        parentCardId: -1,
        cards: [],
        progress: -1,
        stage: -1,
        stageCompleted: false,
        reachedEnd: false,
    }

    setShow("area-town", true)
    setShow("area-dungeon", false)

    removeAllChildren("dungeon-cards")

    if (parentToRemove) {
        removeCard(parentToRemove)
    }
}
