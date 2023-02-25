import { goTo } from "../../view"
import { AspectConfigs, AspectId } from "../../config/aspect-configs"
import { getElementById, removeAllChildren, setText } from "./../../dom"
import "./job-slot"
import { JobsService } from "../aspect-service"

export function loadJobsView(segments: string[]) {
    const segment = segments.pop()
    if (segment !== "primary" && segment !== "secondary") {
        goTo("/character")
        return
    }

    setText("category-jobs", segment)
    getElementById("close-jobs").onclick = () => {
        goTo("/character")
    }

    const parent = getElementById("jobs")
    const isPrimary = segment === "primary"

    const jobs = Object.keys(AspectConfigs).map((jobId) => {
        return JobsService.getJob(jobId as AspectId)
    })
    jobs.sort((a, b) => b.level - a.level)

    for (const job of jobs) {
        const jobSlot = document.createElement("job-slot")
        jobSlot.setAttribute("job-id", job.id)
        jobSlot.setAttribute("primary", isPrimary ? String(isPrimary) : "")
        parent.appendChild(jobSlot)
    }
}

export function unloadJobsView() {
    removeAllChildren("jobs")
}
