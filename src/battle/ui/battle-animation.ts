import { AbilityId } from "../../config/ability-configs"
import { BattlerId } from "../../types"
import { BattleActionFlag, BattleActionLog, BattleRegen } from "../battle-types"
import {
    addBattlerEnergy,
    addBattlerHealth,
    addBattlerScrollingText,
    findBattlerElement,
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

export type Animation = AnimationForward | AnimationSkillUse | AnimationShake | AnimationScrollingText

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

        case "scrolling-text": {
            console.log("activate", animation)
            const icon = animation.abilityId ? `assets/icon/ability/${animation.abilityId}.png` : null

            let color
            if (animation.flags & BattleActionFlag.Energy) {
                color = animation.value >= 0 ? "#03a9f4" : "#9c27b0"
            } else {
                color = animation.value >= 0 ? "#8bc34a" : "#f44336"
            }

            let text = `${Math.abs(animation.value)}`
            if (animation.flags & BattleActionFlag.Miss) {
                text = "Miss"
            } else if (animation.flags & BattleActionFlag.Critical) {
                text += " !"
            }

            addBattlerScrollingText(animation.battlerId, text, color, icon)
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

export function addAnimationsFromLog(tCurrent: number, log: BattleActionLog) {
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
            if (effect.power < 0 && !alreadyShaked) {
                alreadyShaked = true
                animations.push({
                    type: "shake",
                    battlerId: effect.battlerId,
                    tStart: tEffectStart,
                    tEnd: tEffectStart + attackAnimationLength,
                })
            }

            animations.push({
                type: "scrolling-text",
                battlerId: effect.battlerId,
                abilityId: effect.abilityId,
                tStart: tEffectStart,
                tEnd: tEffectStart + attackAnimationLength,
                flags: effect.flags,
                value: effect.power,
            })

            tEffectStart += attackAnimationLength
        }
    }

    tStart = tEffectStart
    forwardAnim.tEnd = tStart

    animations.sort((a, b) => b.tStart - a.tStart)

    return tStart
}

export function addRegenAnimations(tCurrent: number, regens: BattleRegen[]) {
    let tWaitMax = tCurrent + animationRegenDelay

    for (const entry of regens) {
        let tStart = tCurrent + animationRegenDelay

        if (entry.health !== 0) {
            animations.push({
                type: "scrolling-text",
                battlerId: entry.battlerId,
                abilityId: null,
                tStart,
                tEnd: tStart + attackAnimationLength,
                flags: 0,
                value: entry.health,
            })

            tStart += attackAnimationLength
        }

        if (entry.energy !== 0) {
            animations.push({
                type: "scrolling-text",
                battlerId: entry.battlerId,
                abilityId: null,
                tStart,
                tEnd: tStart + attackAnimationLength,
                flags: BattleActionFlag.Energy,
                value: entry.energy,
            })

            tStart += attackAnimationLength
        }

        if (tWaitMax < tStart) {
            tWaitMax = tStart
        }
    }

    animations.sort((a, b) => b.tStart - a.tStart)

    return tWaitMax
}
