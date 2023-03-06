import { SkillConfigs, InstantSkillConfig } from "../../config/skill-configs"
import { getElementById, removeAllChildren, setHTML, setOnClick, setText, toggleClassName } from "../../dom"
import { i18n } from "../../i18n"
import { getAbilityDescription } from "../../skills/ui/abilities-view"
import { getState } from "../../state"
import { BattleService } from "../battle-service"
import { subscribe } from "./../../events"
import { updateView } from "./../../view"
import { BattlerSkill } from "./battle-skill"
import { loadBattler, toggleTeamInactive } from "./battler-item"
import { LoadoutService } from "./../../loadout/loadout-service"

export const loadBattleView = () => {
    updateBattleAuto()
    loadBattlers()
    loadAbilities()
    updateStatus()

    setOnClick("battle-auto", toggleBattleAuto)

    subscribe("battle-start", showBattle)
    subscribe("battle-next-turn", updateNextTurn)
    subscribe("ability-selected", updateAbilityHint)
}

export const unloadBattleView = () => {
    removeAllChildren("battle-column-a")
    removeAllChildren("battle-column-b")
    removeAllChildren("battle-abilities")
}

const showBattle = () => {
    updateView("battle")
}

const loadBattlers = () => {
    const { battle } = getState()

    for (const battler of battle.battlers) {
        loadBattler(battler)
    }
}

const updateStatus = () => {
    const { battle } = getState()

    setText("battle-name", "Dungeon Encounter")
    setText("battle-round", `Turn  ${battle.turn}`)
    setText("battle-level", "Level 1")
}

const updateBattleAuto = () => {
    const { battle } = getState()

    setText("battle-auto", battle.isAuto ? "Auto" : "Manual")
}

const updateAbilityHint = () => {
    const { battle } = getState()

    if (!battle.selectedSkill && battle.status === "waiting") {
        setText("battle-hint", "Select your action")
    } else {
        setText("battle-hint", "")
    }

    renderSkills()
}

const updateNextTurn = () => {
    renderSkills()
    updateStatus()
}

const toggleBattleAuto = () => {
    const { battle } = getState()

    battle.isAuto = !battle.isAuto

    updateBattleAuto()
}

const loadAbilities = () => {
    const { loadout } = getState()

    const parent = getElementById("battle-abilities")

    const element = new BattlerSkill()
    element.setup(LoadoutService.getAttackSkill())
    parent.appendChild(element)

    for (const skill of loadout.skills) {
        if (!skill) {
            continue
        }

        const element = new BattlerSkill()
        element.setup(skill)
        parent.appendChild(element)
    }

    renderSkills()
}

const renderSkills = () => {
    const { battle } = getState()

    const element = getElementById("battle-abilities")
    const children = element.children as unknown as BattlerSkill[]

    toggleClassName("battle-abilities", "inactive", battle.status !== "waiting")

    for (let n = 0; n < children.length; n += 1) {
        const child = children[n]
        child.update()
    }

    if (battle.selectedSkill) {
        const abilityConfig = SkillConfigs[battle.selectedSkill.id] as InstantSkillConfig
        const abilityTooltip = getAbilityDescription(abilityConfig)

        toggleClassName("battle-tooltip", "hide", false)
        setHTML("battle-tooltip-title", i18n(abilityConfig.id))
        setHTML("battle-tooltip-text", abilityTooltip)

        const abilityUsable = BattleService.canTargetTeamA(abilityConfig, battle.isTeamA)
        toggleTeamInactive(!battle.isTeamA, abilityUsable)
        toggleTeamInactive(battle.isTeamA, !abilityUsable)
    } else {
        toggleClassName("battle-tooltip", "hide", true)
        toggleTeamInactive(true, false)
        toggleTeamInactive(false, false)
    }
}
