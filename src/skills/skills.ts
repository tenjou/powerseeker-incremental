import { getState } from "../state"
import { SkillId } from "../types"
import { emit } from "./../events"

export function addSkillExp(skillId: SkillId, xp: number) {
    const { skills } = getState()

    const skill = skills.find((skill) => skill.id === skillId)
    if (!skill) {
        console.error(`Could not find skill with id: ${skillId}`)
        return
    }

    skill.xp += xp

    while (skill.xp >= skill.xpMax) {
        skill.xp -= skill.xpMax
        skill.level += 1
    }

    emit("skill-update", skill)
}
