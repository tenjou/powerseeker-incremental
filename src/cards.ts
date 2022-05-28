import { CardConfigs, CardType } from "./config/CardConfigs"
import { getState } from "./state"
import { addGold, addHp, addStamina } from "./status"
import { Card } from "./types"
import { randomItem } from "./utils"
import { addItem } from "./inventory"
import { addSkillExp } from "./skills"
import { advanceDungeonStage, enterDungeon, handleDungeonCardClick } from "./dungeon"
import { addChild, removeElement, setText, toggleClassName } from "./dom"
import { startBattle } from "./battle"

function loadCard(card: Card, isDungeon: boolean) {
    const cardElement = document.createElement("card")
    cardElement.id = `card-${card.id}`
    cardElement.onclick = () => {
        if (isDungeon) {
            handleDungeonCardClick(card)
        }
        handleCardClick(card)
    }

    addChild(isDungeon ? "dungeon-cards" : "town-cards", cardElement)

    updateCard(card)
}

export function loadCards(cards: Card[], isDungeon: boolean) {
    for (const card of cards) {
        loadCard(card, isDungeon)
    }
}

function updateCard(card: Card) {
    const cardElementId = `card-${card.id}`
    const cardText = `${card.id} | ${card.type}`

    setText(cardElementId, cardText)
    toggleClassName(cardElementId, "disabled", isCardDisabled(card))
}

function updateCards() {
    const { town, dungeon } = getState()

    const cards = dungeon.id ? dungeon.cards : town.cards

    for (const card of cards) {
        updateCard(card)
    }
}

function handleCardClick(card: Card) {
    if (isCardDisabled(card)) {
        return
    }

    const cardConfig = CardConfigs[card.type]
    if (cardConfig.destroy) {
        removeCard(card.id)
    }

    applyCardActions(card)
    updateCards()
}

export function addCard(cardType: CardType) {
    const { town, dungeon, cache } = getState()

    const card: Card = {
        id: cache.lastCardIndex++,
        type: cardType,
    }

    if (dungeon.id) {
        dungeon.cards.push(card)
    } else {
        town.cards.push(card)
    }

    loadCard(card, !!dungeon.id)
}

export function removeCard(id: number) {
    const { town, dungeon } = getState()

    const cards = dungeon.id ? dungeon.cards : town.cards

    const cardIndex = cards.findIndex((entry) => entry.id === id)
    if (cardIndex === -1) {
        console.error(`Could not find card: ${id}`)
        return
    }

    cards.splice(cardIndex, 1)

    removeElement(`card-${id}`)
}

function isCardDisabled(card: Card) {
    const { player, battler } = getState()

    const cardConfig = CardConfigs[card.type]

    for (const action of cardConfig.actions) {
        if (action.type !== "resource") {
            continue
        }
        if (action.value >= 0) {
            continue
        }

        let statusValue = 0

        switch (action.resource) {
            case "hp":
                statusValue = battler.hp
                break
            case "stamina":
                statusValue = player.stamina
                break
            case "gold":
                statusValue = player.gold
                break
        }

        if (statusValue < -action.value) {
            return true
        }
    }

    return false
}

function applyCardActions(card: Card) {
    const cardConfig = CardConfigs[card.type]

    for (const action of cardConfig.actions) {
        switch (action.type) {
            case "resource": {
                switch (action.resource) {
                    case "hp":
                        addHp(action.value)
                        break

                    case "stamina":
                        addStamina(action.value)
                        break

                    case "gold":
                        addGold(action.value)
                        break
                }
                break
            }

            case "add_card":
                addCard(action.card)
                break

            case "add_random_card": {
                const randomCard = randomItem(action.cards)
                addCard(randomCard)
                break
            }

            case "add_item":
                addItem(action.itemType, action.amount)
                break

            case "add_skill_exp":
                addSkillExp(action.skillId, action.amount)
                break

            case "enter_dungeon":
                enterDungeon(action.dungeonId, card.id)
                break

            case "next_stage":
                advanceDungeonStage()
                break

            case "start_battle":
                startBattle(card.id, action)
                break
        }
    }
}
