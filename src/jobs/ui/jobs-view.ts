import { goTo } from "../../view"
import { JobConfigs, JobId } from "./../../config/job-configs"
import { getElement, removeAllChildren, setText } from "./../../dom"
import "./job-slot"
import { JobsService } from "./../jobs-service"

export function loadJobsView(segments: string[]) {
    const segment = segments.pop()
    if (segment !== "primary" && segment !== "secondary") {
        goTo("/")
        return
    }

    setText("category-jobs", segment)

    const parent = getElement("jobs")
    const isPrimary = segment === "primary"

    const jobs = Object.keys(JobConfigs).map((jobId) => {
        return JobsService.getJob(jobId as JobId)
    })
    jobs.sort((a, b) => b.level - a.level)

    for (const job of jobs) {
        const jobSlot = document.createElement("job-slot")
        jobSlot.setAttribute("job-id", job.id)
        jobSlot.setAttribute("primary", String(isPrimary))
        parent.appendChild(jobSlot)
    }
}

export function unloadJobsView() {
    removeAllChildren("jobs")
}
