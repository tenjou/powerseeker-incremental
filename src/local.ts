interface LocalEntry {
    en: string
}

type Languages = "en"

const lang: Languages = "en"

const local: Record<string, LocalEntry> = {
    body: {
        en: "Body",
    },
    main_hand: {
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
    none: {
        en: "None",
    },
    armor: {
        en: "Armor",
    },
    consumable: {
        en: "Consumable",
    },
}

export function i18n(key: string) {
    const entry = local[key]
    if (!entry) {
        return `__${key}__`
    }
    return entry[lang]
}
