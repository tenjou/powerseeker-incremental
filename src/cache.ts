import { Item } from "./inventory/item-types"

interface Cache {
    selectedItem: Item | null
}

const cache: Cache = {
    selectedItem: null,
}

export function getCache() {
    return cache
}
