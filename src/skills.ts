import { SkillId } from "./types"
import { getState } from "./state"
import { setText } from "./dom"

export function updateSkills() {
    const skills = getState().skills

    for (const skillId in skills) {
        const skill = skills[skillId as SkillId]
        setText(`value-${skillId}`, `${skillId} (Level ${skill.level}): ${skill.xp} / ${skill.xpMax}`)
    }
}

export function addSkillExp(skillId: SkillId, xp: number) {
    const skill = getState().skills[skillId]
    skill.xp += xp

    while (skill.xp >= skill.xpMax) {
        skill.xp -= skill.xpMax
        skill.level += 1
    }

    updateSkills()
}
