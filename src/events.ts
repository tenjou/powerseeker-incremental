type EventType =
    | "item-add"
    | "item-remove"
    | "item-update"
    | "equip"
    | "unequip"
    | "skill-update"
    | "close"
    | "currency-added"
    | "currency-removed"

type CallbackFunc = (payload: unknown) => void

const subscribers: Partial<Record<EventType, CallbackFunc[]>> = {}

export function subscribe<T>(type: EventType, callback: (payload: T) => void) {
    const funcs = subscribers[type]
    if (funcs) {
        funcs.push(callback as CallbackFunc)
    } else {
        subscribers[type] = [callback as CallbackFunc]
    }
}

export function unsubscribe<T>(type: EventType, callback: (payload: T) => void) {
    const funcs = subscribers[type]
    if (!funcs) {
        return
    }

    const index = funcs.indexOf(callback as CallbackFunc)
    if (index === -1) {
        return
    }

    funcs[index] = funcs[funcs.length - 1]
    funcs.pop()
}

export function emit(type: EventType, payload: unknown) {
    const funcs = subscribers[type]
    if (!funcs || !funcs.length) {
        return
    }

    for (const listener of funcs) {
        listener(payload)
    }
}
