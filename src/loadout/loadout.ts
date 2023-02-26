import { SkillId } from "../config/skill-configs"
import { getState } from "../state"

export function equipAbility(abilityId: SkillId) {
    const { skills: abilities, loadout } = getState()

    const ability = abilities[abilityId]
    if (!ability) {
        console.error(`Does not have ability: ${abilityId}`)
        return
    }

    loadout.abilities.push({
        id: ability.id,
        rank: ability.rank,
        cooldown: 0,
    })
}
