interface LocalEntry {
    en: string
}

type Languages = "en"

const lang: Languages = "en"

const local: Record<string, LocalEntry> = {
    body: {
        en: "Body",
    },
    hand_1: {
        en: "Main Hand",
    },
    copper_ore: {
        en: "Copper Ore",
    },
    carp: {
        en: "Carp",
    },
    mapple_log: {
        en: "Mapple Log",
    },
    leather_clothing: {
        en: "Leather Clothing",
    },
    health_potion: {
        en: "Health Potion",
    },
}

export function i18n(key: string) {
    return local[key][lang] || `__${key}__`
}
