import { getState } from "../state"
import { LevelConfig } from "../config/level-config"
import { addCurrency } from "./../currencies/currencies"

export const PlayerService = {
    addExp(exp: number) {
        const { player, jobs } = getState()

        const job = jobs[player.jobPrimary]
        if (!job) {
            console.error(`Job not available: ${player.jobPrimary}`)
            return
        }

        if (job.level >= LevelConfig.length) {
            return
        }

        job.exp += exp

        let expMax = LevelConfig[job.level - 1]

        while (job.exp > expMax) {
            job.level += 1

            addCurrency("ap", job.level - 1)

            if (job.level >= LevelConfig.length) {
                job.exp = 0
                return
            }

            job.exp -= expMax
            expMax = LevelConfig[job.level - 1]
        }
    },
}
