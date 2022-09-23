import { AbilityId } from "../../config/ability-configs"
import { BattlerId } from "../../types"
import { BattleActionLog } from "../battle-types"
import { addBattlerHp, addBattlerScrollingText, showBattlerAbility, toggleBattlerForward, toggleBattlerShake } from "./battler-item"

const animations: Animation[] = []
const animationsActive: Animation[] = []
let tAnim = 0

export interface BattleAnimationBasic {
    battlerId: BattlerId
    tStart: number
    tEnd: number
}

interface AnimationForward extends BattleAnimationBasic {
    type: "forward"
}

interface AnimationShake extends BattleAnimationBasic {
    type: "shake"
}

interface AnimationSkillUse extends BattleAnimationBasic {
    type: "ability-use"
    abilityId: AbilityId
}

interface AnimationScrollingText extends BattleAnimationBasic {
    type: "scrolling-text"
    value: number
    isCritical: boolean
    isMiss: boolean
}

export type Animation = AnimationForward | AnimationSkillUse | AnimationShake | AnimationScrollingText

function activateAnimation(animation: Animation) {
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

        case "scrolling-text": {
            const color = animation.value >= 0 ? "#8bc34a" : "#f44336"

            let text = `${Math.abs(animation.value)}`
            if (animation.isMiss) {
                text = "miss"
            } else {
                text += " !"
            }

            addBattlerScrollingText(animation.battlerId, text, color)
            addBattlerHp(animation.battlerId, animation.value)
            break
        }
    }
}

function deactivateAnimation(animation: Animation) {
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

export function updateBattleAnimation(tDelta: number) {
    tAnim += tDelta

    if (animations.length > 0) {
        const animation = animations[animations.length - 1]
        if (animation.tStart <= tAnim) {
            animations.pop()
            animationsActive.push(animation)
            animationsActive.sort((a, b) => b.tEnd - a.tEnd)
            activateAnimation(animation)
        }
    }

    if (animationsActive.length > 0) {
        const animation = animationsActive[animationsActive.length - 1]
        if (animation.tEnd <= tAnim) {
            animationsActive.pop()
            deactivateAnimation(animation)
        }
    }
}

export function addAnimationsFromLog(log: BattleActionLog) {
    animations.push({
        type: "forward",
        battlerId: log.casterId,
        tStart: tAnim,
        tEnd: tAnim + 1600,
    })

    animations.push({
        type: "ability-use",
        battlerId: log.casterId,
        tStart: tAnim + 100,
        tEnd: tAnim + 100 + 800,
        abilityId: log.abilityId,
    })

    for (const target of log.targets) {
        if (target.power < 0) {
            animations.push({
                type: "shake",
                battlerId: target.battlerId,
                tStart: tAnim + 1000,
                tEnd: tAnim + 1000 + 200,
            })
        }

        animations.push({
            type: "scrolling-text",
            battlerId: target.battlerId,
            tStart: tAnim + 1000,
            tEnd: tAnim + 1000 + 200,
            isCritical: target.isCritical,
            isMiss: target.isMiss,
            value: target.power,
        })
    }

    animations.sort((a, b) => b.tStart - a.tStart)
}
