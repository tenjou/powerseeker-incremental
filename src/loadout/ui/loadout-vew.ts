import { SkillConfigs } from "../../config/skill-configs"
import { goTo } from "../../view"
import { setText } from "../../dom"
import { getState } from "../../state"

export function loadLoadoutView(segments: string[]) {
    const categoryId = segments.pop()
    if (!categoryId) {
        goBack()
        return
    }

    switch (categoryId) {
        case "ability":
            break
        case "item":
            break
    }

    setText("loadout-category", categoryId)

    const { skills: abilities } = getState()
    const equippableAbilities = Object.values(abilities).filter((entry) => {
        const abilityConfig = SkillConfigs[entry.id]
        return abilityConfig.type !== "passive"
    })
}

export function unloadLoadoutView() {}

function goBack() {
    goTo("/character")
}
