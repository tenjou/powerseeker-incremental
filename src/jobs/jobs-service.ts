import { JobId } from "../config/job-configs"
import { getState } from "../state"
import { Job } from "./jobs-types"

export const JobsService = {
    selectPrimaryJob(jobId: JobId) {
        const { player, jobs } = getState()

        if (player.jobPrimary === jobId) {
            return
        }

        if (player.jobSecondary === jobId) {
            this.swapJobs()
            return
        }

        player.jobPrimary = jobId

        if (!jobs[jobId]) {
            jobs[jobId] = this.createJob(jobId)
        }
    },

    selectSecondaryJob(jobId: JobId | null) {
        const { player, jobs } = getState()

        if (player.jobSecondary === jobId) {
            return
        }

        if (!jobId) {
            player.jobSecondary = null
            return
        }

        if (player.jobPrimary === jobId) {
            this.swapJobs()
            return
        }

        player.jobSecondary = jobId

        if (!jobs[jobId]) {
            jobs[jobId] = this.createJob(jobId)
        }
    },

    swapJobs() {
        const { player } = getState()

        if (!player.jobSecondary) {
            console.error("Player does not have a secondary job")
            return
        }

        const jobPrimary = player.jobPrimary
        player.jobPrimary = player.jobSecondary
        player.jobSecondary = jobPrimary
    },

    getJob(jobId: JobId) {
        const { jobs } = getState()

        const job = jobs[jobId] || this.createJob(jobId)

        return job
    },

    createJob(jobId: JobId): Job {
        return {
            id: jobId,
            exp: 0,
            level: 1,
        }
    },
}
