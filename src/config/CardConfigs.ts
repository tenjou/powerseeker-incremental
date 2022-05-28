import { SkillId } from "../types"
import { ItemId } from "./ItemConfigs"
import { MonsterId } from "./MonsterConfigs"

type ResourceType = "hp" | "stamina" | "gold"

export type CardType =
    | "inn"
    | "resource"
    | "unknown_location"
    | "work"
    | "unknown_resource"
    | "woodcutting_resource"
    | "mining_resource"
    | "fishing_resource"
    | "dungeon"
    | "door"
    | "reward_chest_1"
    | "encounter_boar"

interface ResourceAction {
    type: "resource"
    resource: ResourceType
    value: number
}

interface AddCardAction {
    type: "add_card"
    card: CardType
}

interface AddRandomCardAction {
    type: "add_random_card"
    cards: CardType[]
}

interface AddItemAction {
    type: "add_item"
    itemId: ItemId
    amount: number
}

interface AddSkillExpAction {
    type: "add_skill_exp"
    skillId: SkillId
    amount: number
}

interface EnterDungeonAction {
    type: "enter_dungeon"
    dungeonId: string
}

interface NextStageAction {
    type: "next_stage"
}

export interface StartBattleAction {
    type: "start_battle"
    monsters: MonsterId[]
}

type Action =
    | ResourceAction
    | AddCardAction
    | AddRandomCardAction
    | AddItemAction
    | AddSkillExpAction
    | EnterDungeonAction
    | NextStageAction
    | StartBattleAction

interface CardConfig {
    actions: Action[]
    destroy: boolean
}

export const CardConfigs: Record<CardType, CardConfig> = {
    inn: {
        actions: [
            {
                type: "resource",
                resource: "gold",
                value: -1,
            },
            {
                type: "resource",
                resource: "hp",
                value: Number.MAX_SAFE_INTEGER,
            },
            {
                type: "resource",
                resource: "stamina",
                value: Number.MAX_SAFE_INTEGER,
            },
        ],
        destroy: false,
    },
    resource: {
        actions: [],
        destroy: false,
    },
    unknown_location: {
        actions: [
            {
                type: "resource",
                resource: "stamina",
                value: -1,
            },
            {
                type: "add_card",
                card: "inn",
            },
            {
                type: "add_card",
                card: "work",
            },
        ],
        destroy: true,
    },
    work: {
        actions: [
            {
                type: "resource",
                resource: "stamina",
                value: -2,
            },
            {
                type: "resource",
                resource: "gold",
                value: 1,
            },
            {
                type: "add_card",
                card: "unknown_resource",
            },
        ],
        destroy: false,
    },
    unknown_resource: {
        actions: [
            {
                type: "resource",
                resource: "stamina",
                value: -1,
            },
            {
                type: "add_random_card",
                cards: ["mining_resource", "woodcutting_resource", "fishing_resource"],
            },
        ],
        destroy: true,
    },
    fishing_resource: {
        actions: [
            {
                type: "resource",
                resource: "stamina",
                value: -1,
            },
            {
                type: "add_item",
                itemId: "carp",
                amount: 1,
            },
            {
                type: "add_skill_exp",
                skillId: "fishing",
                amount: 20,
            },
        ],
        destroy: true,
    },
    mining_resource: {
        actions: [
            {
                type: "resource",
                resource: "stamina",
                value: -1,
            },
            {
                type: "add_item",
                itemId: "copper_ore",
                amount: 1,
            },
            {
                type: "add_skill_exp",
                skillId: "mining",
                amount: 20,
            },
        ],
        destroy: true,
    },
    woodcutting_resource: {
        actions: [
            {
                type: "resource",
                resource: "stamina",
                value: -1,
            },
            {
                type: "add_item",
                itemId: "mapple_log",
                amount: 1,
            },
            {
                type: "add_skill_exp",
                skillId: "woodcutting",
                amount: 20,
            },
        ],
        destroy: true,
    },
    dungeon: {
        actions: [
            {
                type: "enter_dungeon",
                dungeonId: "test_dungeon",
            },
        ],
        destroy: false,
    },
    door: {
        actions: [
            {
                type: "next_stage",
            },
        ],
        destroy: false,
    },
    reward_chest_1: {
        actions: [
            {
                type: "add_item",
                itemId: "mapple_log",
                amount: 10,
            },
        ],
        destroy: true,
    },
    encounter_boar: {
        actions: [
            {
                type: "start_battle",
                monsters: ["boar"],
            },
        ],
        destroy: true,
    },
}
