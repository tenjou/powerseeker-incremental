import { JobId } from "../config/job-configs"

export interface Job {
    id: JobId
    exp: number
    level: number
}
