import { AspectId } from "../config/aspect-configs"
import { emit } from "../events"
import { getState } from "../state"

export const AspectService = {
    select(aspectId: AspectId) {
        const { player } = getState()

        const aspect = AspectService.get(aspectId)

        player.aspectId = aspect.id

        emit("aspect-selected", aspect.id)
    },

    create(aspectId: AspectId) {
        const { aspects } = getState()

        if (aspects[aspectId]) {
            throw new Error(`Aspect ${aspectId} already exists`)
        }

        aspects[aspectId] = {
            id: aspectId,
            exp: 0,
            level: 1,
        }
    },

    get(aspectId: AspectId) {
        const { aspects } = getState()

        const aspect = aspects[aspectId]
        if (!aspect) {
            throw new Error(`Aspect ${aspectId} does not exist`)
        }

        return aspect
    },
}
