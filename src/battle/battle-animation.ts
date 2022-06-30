import { getState } from "../state"
import { AbilityId, BattlerId } from "../types"
import { addBattlerScrollingText, showBattlerAbility, toggleBattlerForward, toggleBattlerShake } from "./components/battler-item"

export interface BattleAnimationBasic {
    battlerId: BattlerId
    tStart: number
    tEnd: number
}

interface BattleAnimationForward extends BattleAnimationBasic {
    type: "forward"
}

interface BattleAnimationShake extends BattleAnimationBasic {
    type: "shake"
}

interface BattleAnimationSkillUse extends BattleAnimationBasic {
    type: "ability-use"
    abilityId: AbilityId
}

interface BattleAnimationScrollingText extends BattleAnimationBasic {
    type: "scrolling-text"
    value: number
    isCritical: boolean
    isMiss: boolean
}

export type BattleAnimation = BattleAnimationForward | BattleAnimationSkillUse | BattleAnimationShake | BattleAnimationScrollingText

function activateAnimation(animation: BattleAnimation) {
    switch (animation.type) {
        case "forward":
            toggleBattlerForward(animation.battlerId, true)
            break

        case "ability-use":
            showBattlerAbility(animation.battlerId, animation.abilityId)
            break

        case "shake":
            toggleBattlerShake(animation.battlerId, true)
            break

        case "scrolling-text":
            addBattlerScrollingText(animation.battlerId, "1234!")
            break
    }
}

function deactivateAnimation(animation: BattleAnimation) {
    switch (animation.type) {
        case "forward":
            toggleBattlerForward(animation.battlerId, false)
            break

        case "ability-use":
            showBattlerAbility(animation.battlerId)
            break

        case "shake":
            toggleBattlerShake(animation.battlerId, false)
            break

        case "scrolling-text":
            break
    }
}

export function updateBattleAnimation() {
    const { battle } = getState()
    const { animations, animationsActive } = battle

    if (animations.length > 0) {
        const animation = animations[animations.length - 1]
        if (animation.tStart <= battle.tCurrent) {
            animations.pop()
            animationsActive.push(animation)
            animationsActive.sort((a, b) => b.tEnd - a.tEnd)
            activateAnimation(animation)
        }
    }

    if (animationsActive.length > 0) {
        const animation = animationsActive[animationsActive.length - 1]
        if (animation.tEnd <= battle.tCurrent) {
            animationsActive.pop()
            deactivateAnimation(animation)
        }
    }
}
