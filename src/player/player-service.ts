import { getState } from "../state"
import { LevelConfig } from "../config/level-config"
import { addCurrency } from "./../currencies/currencies"

export const PlayerService = {
    addExp(xp: number) {
        const { player } = getState()

        if (player.level >= LevelConfig.length) {
            return
        }

        player.xp += xp

        let xpMax = LevelConfig[player.level - 1]

        while (player.xp > xpMax) {
            player.level += 1

            addCurrency("ap", player.level - 1)

            if (player.level >= LevelConfig.length) {
                player.xp = 0
                return
            }

            player.xp -= xpMax
            xpMax = LevelConfig[player.level - 1]
        }
    },
}
