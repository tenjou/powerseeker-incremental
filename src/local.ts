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
    rarity0: {
        en: "Common",
    },
    rarity1: {
        en: "Uncommon",
    },
    rarity2: {
        en: "Rare",
    },
    rarity3: {
        en: "Epic",
    },
    rarity4: {
        en: "Legendary",
    },
    level: {
        en: "Level",
    },
    exp: {
        en: "Experience",
    },
    health: {
        en: "Health",
    },
    attack: {
        en: "Attack",
    },
    defense: {
        en: "Defense",
    },
    accuracy: {
        en: "Accuracy",
    },
    evasion: {
        en: "Evasion",
    },
    speed: {
        en: "Speed",
    },
    stamina: {
        en: "Stamina",
    },
    gold: {
        en: "Gold",
    },
}

export function i18n(key: string | undefined | null) {
    if (!key) {
        return "undefined"
    }

    const entry = local[key]
    if (!entry) {
        return `__${key}__`
    }
    return entry[lang]
}
