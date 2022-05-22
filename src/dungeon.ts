import { DungeonConfigs } from "./config/DungeonConfigs"
import { removeAllChildren, setOnClick, setShow, setText } from "./dom"
import { getState } from "./state"
import { addCard } from "./cards"
import { Card } from "./types"

export function setupDungeonSystem() {
    setOnClick("dungeon-exit", exitDungeon)
}

export function enterDungeon(dungeonId: string) {
    const { dungeon } = getState()

    const dungeonConfig = DungeonConfigs[dungeonId]
    if (!dungeonConfig) {
        console.error(`Could not find dungeon config: ${dungeonId}`)
        return
    }

    dungeon.id = dungeonId
    dungeon.progress = 0
    dungeon.stage = 0

    setShow("area-town", false)

    setText("dungeon-name", dungeonConfig.name)
    setShow("area-dungeon", true)
    populateDungeonStage()

    updateDungeonStatus()
}

export function advanceDungeonStage() {
    const { dungeon } = getState()

    dungeon.stage++
    dungeon.progress = 0
    dungeon.stageCompleted = false
    dungeon.cards.length = 0

    removeAllChildren("dungeon-cards")
    populateDungeonStage()

    updateDungeonStatus()
}

function populateDungeonStage() {
    const { dungeon } = getState()

    const dungeonConfig = DungeonConfigs[dungeon.id]
    const dungeonStageConfig = dungeonConfig.stages[dungeon.stage]

    for (const cardId of dungeonStageConfig.cards) {
        addCard(cardId, handleDungeonCardClick)
    }
}

function handleDungeonCardClick(card: Card) {
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

function updateDungeonStatus() {
    const { dungeon } = getState()

    const dungeonConfig = DungeonConfigs[dungeon.id]

    const dungeonStageConfig = dungeonConfig.stages[dungeon.stage]
    const progress = Math.min(dungeonStageConfig.progressRequired, dungeon.progress)

    setText("dungeon-stage", `Stage: ${dungeon.stage + 1}/${dungeonConfig.stages.length}`)
    setText("dungeon-progress", `Progress: ${progress}/${dungeonStageConfig.progressRequired}`)
}

function exitDungeon() {
    const state = getState()

    state.dungeon = {
        id: "",
        cards: [],
        progress: -1,
        stage: -1,
        stageCompleted: false,
        reachedEnd: false,
    }

    setShow("area-town", true)
    setShow("area-dungeon", false)

    removeAllChildren("dungeon-cards")
}
