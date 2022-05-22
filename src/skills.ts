import { SkillId } from "./types"
import { getState } from "./state"
import { setText } from "./dom"

export function updateSkills() {
    const skills = getState().skills

    for (const skillId in skills) {
        const skill = skills[skillId as SkillId]
        setText(
            `value-${skillId}`,
            `${skillId} (Level ${skill.level}): ${skill.exp} / ${skill.expMax}`
        )
    }
}

export function addSkillExp(skillId: SkillId, exp: number) {
    const skill = getState().skills[skillId]
    skill.exp += exp

    while (skill.exp >= skill.expMax) {
        skill.exp -= skill.expMax
        skill.level += 1
    }

    updateSkills()
}
