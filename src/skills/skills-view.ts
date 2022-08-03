import { getState } from "./../state"
import { setText } from "./../dom"
import { Skill } from "../types"
import { subscribe, unsubscribe } from "./../events"

export function loadSkillsView() {
    const { skills } = getState()

    for (const skill of skills) {
        updateSkill(skill)
    }

    subscribe("skill-update", updateSkill)
}

export function unloadSkillsView() {
    unsubscribe("skill-update", updateSkill)
}

function updateSkill(skill: Skill) {
    setText(`skill-${skill.id}`, `${skill.id} (Level ${skill.level}): ${skill.xp} / ${skill.xpMax}`)
}
