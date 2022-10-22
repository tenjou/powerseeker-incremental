import { AbilityId } from "../../config/ability-configs"
import { BattlerId } from "../../types"
import { BattleActionFlag, BattleBattlerLogs, BattleRegenTarget } from "../battle-types"
import {
    addBattlerEffect,
    addBattlerEnergy,
    addBattlerHealth,
    addBattlerScrollingText,
    findBattlerElement,
    removeBattlerEffect,
    toggleBattlerForward,
    toggleBattlerShake,
} from "./battler-item"

const attackAnimationLength = 450
const animationRegenDelay = 1000

const animations: Animation[] = []
const animationsActive: Animation[] = []

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
    energy: number
}

interface AnimationScrollingText extends BattleAnimationBasic {
    type: "scrolling-text"
    abilityId: AbilityId | null
    value: number
    flags: BattleActionFlag
}

interface AnimationEffectAdd extends BattleAnimationBasic {
    type: "effect-add"
    abilityId: AbilityId
    effectId: number
    duration: number
}

interface AnimationEffectRemove extends BattleAnimationBasic {
    type: "effect-remove"
    effectId: number
}

export type Animation =
    | AnimationForward
    | AnimationSkillUse
    | AnimationShake
    | AnimationScrollingText
    | AnimationEffectAdd
    | AnimationEffectRemove

function activateAnimation(animation: Animation) {
    switch (animation.type) {
        case "forward":
            toggleBattlerForward(animation.battlerId, true)
            break

        case "ability-use":
            addBattlerEnergy(animation.battlerId, animation.energy, animation.abilityId)
            break

        case "shake":
            toggleBattlerShake(animation.battlerId, true)
            break

        case "effect-add":
            addBattlerEffect(animation.battlerId, animation.effectId, animation.abilityId, animation.duration)
            break

        case "effect-remove":
            removeBattlerEffect(animation.battlerId, animation.effectId)
            break

        case "scrolling-text": {
            const icon = animation.abilityId ? `assets/icon/ability/${animation.abilityId}.png` : null

            let color
            if (animation.flags & BattleActionFlag.Energy) {
                color = animation.value >= 0 ? "#03a9f4" : "#9c27b0"
            } else {
                color = animation.value >= 0 ? "#8bc34a" : "#f44336"
            }

            let hideText = animation.value === 0
            let text = `${Math.abs(animation.value)}`
            if (animation.flags & BattleActionFlag.Miss) {
                hideText = false
                text = "Miss"
            } else if (animation.flags & BattleActionFlag.Critical) {
                hideText = false
                text += " !"
            }

            addBattlerScrollingText(animation.battlerId, hideText ? "" : text, color, icon)
            if (animation.flags & BattleActionFlag.Energy) {
                addBattlerEnergy(animation.battlerId, animation.value)
            } else {
                addBattlerHealth(animation.battlerId, animation.value)
            }
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
            findBattlerElement(animation.battlerId).update(animation.battlerId)
            break

        case "shake":
            toggleBattlerShake(animation.battlerId, false)
            break

        case "scrolling-text":
            break
    }
}

export function updateBattleAnimation(tCurrent: number) {
    if (animations.length > 0) {
        const animation = animations[animations.length - 1]
        if (animation.tStart <= tCurrent) {
            animations.pop()
            animationsActive.push(animation)
            animationsActive.sort((a, b) => b.tEnd - a.tEnd)
            activateAnimation(animation)
        }
    }

    if (animationsActive.length > 0) {
        const animation = animationsActive[animationsActive.length - 1]
        if (animation.tEnd <= tCurrent) {
            animationsActive.pop()
            deactivateAnimation(animation)
        }
    }
}

export function addAnimationsFromLog(tCurrent: number, log: BattleBattlerLogs) {
    let tStart = tCurrent

    const forwardAnim: Animation = {
        type: "forward",
        battlerId: log.casterId,
        tStart,
        tEnd: tStart,
    }
    animations.push(forwardAnim)

    tStart += 100
    animations.push({
        type: "ability-use",
        battlerId: log.casterId,
        tStart: tStart,
        tEnd: tStart + 800,
        abilityId: log.abilityId,
        energy: log.energy,
    })

    tStart += 800
    let tEffectStart = 0

    for (const targetEffects of log.targets) {
        let alreadyShaked = false
        tEffectStart = tStart

        for (const effect of targetEffects) {
            switch (effect.type) {
                case "basic": {
                    if (effect.power < 0 && !alreadyShaked) {
                        alreadyShaked = true
                        animations.push({
                            type: "shake",
                            battlerId: effect.targetId,
                            tStart: tEffectStart,
                            tEnd: tEffectStart + attackAnimationLength,
                        })
                    }

                    animations.push({
                        type: "scrolling-text",
                        battlerId: effect.targetId,
                        abilityId: null,
                        tStart: tEffectStart,
                        tEnd: tEffectStart + attackAnimationLength,
                        flags: effect.flags,
                        value: effect.power,
                    })

                    tEffectStart += attackAnimationLength
                    break
                }

                case "effect-added":
                    animations.push({
                        type: "effect-add",
                        abilityId: log.abilityId,
                        battlerId: effect.targetId,
                        duration: effect.duration,
                        effectId: effect.effectId,
                        tStart: tEffectStart,
                        tEnd: tEffectStart,
                    })
                    break

                case "effect-removed":
                    animations.push({
                        type: "effect-remove",
                        battlerId: effect.targetId,
                        effectId: effect.effectId,
                        tStart: tEffectStart,
                        tEnd: tEffectStart,
                    })
                    break
            }
        }
    }

    tStart = tEffectStart
    forwardAnim.tEnd = tStart

    animations.sort((a, b) => b.tStart - a.tStart)

    return tStart
}

export function addRegenAnimations(tCurrent: number, regenTargets: BattleRegenTarget[]) {
    let tWaitMax = tCurrent + animationRegenDelay

    for (const target of regenTargets) {
        let tStart = tCurrent

        for (const regen of target.regens) {
            animations.push({
                type: "scrolling-text",
                battlerId: target.battlerId,
                abilityId: regen.abilityId,
                tStart,
                tEnd: tStart + attackAnimationLength,
                flags: regen.flags,
                value: regen.value,
            })

            tStart += animationRegenDelay
        }

        if (tWaitMax < tStart) {
            tWaitMax = tStart
        }
    }

    animations.sort((a, b) => b.tStart - a.tStart)

    return tWaitMax
}
