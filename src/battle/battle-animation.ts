import { getState } from "../state"
import { BattlerId } from "../types"
import { showBattlerAbility, toggleBattlerForward } from "./components/battler-item"

export interface BattleAnimationBasic {
    battlerId: BattlerId
    tStart: number
    tEnd: number
}

interface BattleAnimationForward extends BattleAnimationBasic {
    type: "forward"
}

interface BattleAnimationShake {}

interface BattleAnimationSkillUse extends BattleAnimationBasic {
    type: "skill-use"
    abilityId: string
}

export type BattleAnimation = BattleAnimationForward | BattleAnimationSkillUse

function activateAnimation(animation: BattleAnimation) {
    switch (animation.type) {
        case "forward":
            toggleBattlerForward(animation.battlerId, true)
            break

        case "skill-use":
            showBattlerAbility(animation.battlerId, animation.abilityId)
            break
    }
}

function deactivateAnimation(animation: BattleAnimation) {
    switch (animation.type) {
        case "forward":
            toggleBattlerForward(animation.battlerId, false)
            break

        case "skill-use":
            showBattlerAbility(animation.battlerId)
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
