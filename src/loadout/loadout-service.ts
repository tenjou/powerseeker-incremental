import { EquipmentType } from "../config/item-configs"
import { SkillId } from "../config/skill-configs"
import { getState } from "../state"
import { LoadoutSkill } from "./loadout-types"

const BasicSkills: Partial<Record<SkillId, LoadoutSkill>> = {
    fire_attack: { id: "fire_attack", rank: 1, cooldown: 0 },
    water_attack: { id: "water_attack", rank: 1, cooldown: 0 },
    earth_attack: { id: "earth_attack", rank: 1, cooldown: 0 },
    air_attack: { id: "air_attack", rank: 1, cooldown: 0 },
}

const EquipmentBasicSkill: Record<EquipmentType, SkillId> = {
    axe: "fire_attack",
    sword: "earth_attack",
    armor: "fire_attack",
}

export const LoadoutService = {
    equipSkill(skillId: SkillId) {
        const { skills: abilities, loadout } = getState()

        const ability = abilities[skillId]
        if (!ability) {
            console.error(`Does not have ability: ${skillId}`)
            return
        }

        loadout.skills.push({
            id: ability.id,
            rank: ability.rank,
            cooldown: 0,
        })
    },

    equipBasicAttack(equipmentType: EquipmentType) {
        const { loadout } = getState()

        loadout.attack = EquipmentBasicSkill[equipmentType]
    },

    getAttackSkill() {
        const { loadout } = getState()

        const basicSkill = BasicSkills[loadout.attack]

        return basicSkill
    },
}
