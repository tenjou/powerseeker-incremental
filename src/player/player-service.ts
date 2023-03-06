import { AspectService } from "../aspects/aspect-service"
import { LevelConfig } from "../config/level-config"
import { emit } from "../events"
import { getState } from "../state"

export const PlayerService = {
    calculateStats() {
        const { player, battler } = getState()

        const aspect = AspectService.get(player.aspectId)

        battler.stats = {
            health: 15 + aspect.level * 5,
            mana: 8 + aspect.level * 2,
            regenHealth: 0,
            regenMana: 0,
            accuracy: aspect.level,
            evasion: aspect.level,
            block: 100,
            critical: 1,
            speed: 100,
            firePower: aspect.level,
            waterPower: aspect.level,
            earthPower: aspect.level,
            airPower: aspect.level,
            fireResistance: 0,
            waterResistance: 0,
            earthResistance: 0,
            airResistance: 0,
        }
        battler.health = battler.stats.health
        battler.mana = battler.stats.mana

        emit("attributes-updated", battler.stats)
    },

    addSp(sp: number) {
        const { player } = getState()

        player.sp += sp

        emit("sp-updated", player.sp)
    },

    addExp(exp: number) {
        const { player } = getState()

        const aspect = AspectService.get(player.aspectId)

        if (aspect.level > LevelConfig.length) {
            return
        }

        aspect.exp += exp

        const prevLevel = aspect.level
        let expMax = LevelConfig[aspect.level - 1]

        while (aspect.exp > expMax) {
            aspect.level += 1

            if (aspect.level > LevelConfig.length) {
                aspect.exp = 0
                break
            }

            aspect.exp -= expMax
            expMax = LevelConfig[aspect.level - 1]
        }

        if (aspect.level !== prevLevel) {
            this.calculateStats()
        }

        emit("exp-updated", aspect.exp)
    },
}
