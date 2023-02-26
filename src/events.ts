type EventType =
    | "item-added"
    | "item-remove"
    | "item-updated"
    | "equip"
    | "unequip"
    | "skill-update"
    | "close"
    | "currency-updated"
    | "area-added"
    | "area-removed"
    | "area-updated"
    | "location-added"
    | "location-updated"
    | "exploration-started"
    | "exploration-ended"
    | "battle-start"
    | "battle-end"
    | "battle-next-turn"
    | "ability-selected"
    | "ability-updated"
    | "aspect-selected"
    | "attributes-updated"
    | "exp-updated"
    | "sp-updated"

type EventCallbackFunc = (payload: unknown) => void

export interface EventCallbackInfo {
    type: EventType
    callback: EventCallbackFunc
}

const subscribers: Partial<Record<EventType, EventCallbackFunc[]>> = {}
let subscriberWatcher: (info: EventCallbackInfo) => void | null = null

export function subscribe<T>(type: EventType, callback: (payload: T) => void): (payload: T) => void {
    const funcs = subscribers[type]
    if (funcs) {
        funcs.push(callback as EventCallbackFunc)
    } else {
        subscribers[type] = [callback as EventCallbackFunc]
    }

    if (subscriberWatcher) {
        subscriberWatcher({ type, callback })
    }

    return callback
}

export function unsubscribe<T>(type: EventType, callback: (payload: T) => void) {
    const funcs = subscribers[type]
    if (!funcs) {
        return
    }

    const index = funcs.indexOf(callback as EventCallbackFunc)
    if (index === -1) {
        return
    }

    funcs[index] = funcs[funcs.length - 1]
    funcs.pop()
}

export function emit(type: EventType, payload: unknown = undefined) {
    const funcs = subscribers[type]
    if (!funcs || !funcs.length) {
        return
    }

    for (const listener of funcs) {
        listener(payload)
    }
}

export const watchSubscribers = (func: (info: EventCallbackInfo) => void | null) => {
    subscriberWatcher = func
}
