import { getState } from "../state"
import { LevelConfig } from "../config/level-config"
import { addCurrency } from "./../currencies/currencies"
import { AspectService } from "../aspects/aspect-service"

export const PlayerService = {
    addExp(exp: number) {
        const { player } = getState()

        const aspect = AspectService.get(player.aspectId)

        if (aspect.level >= LevelConfig.length) {
            return
        }

        aspect.exp += exp

        let expMax = LevelConfig[aspect.level - 1]

        while (aspect.exp > expMax) {
            aspect.level += 1

            addCurrency("ap", aspect.level - 1)

            if (aspect.level >= LevelConfig.length) {
                aspect.exp = 0
                return
            }

            aspect.exp -= expMax
            expMax = LevelConfig[aspect.level - 1]
        }
    },
}
