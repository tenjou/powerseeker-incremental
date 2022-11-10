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
    maple_log: {
        en: "Maple Log",
    },
    leather_clothing: {
        en: "Leather Clothing",
    },
    health_potion: {
        en: "Health Potion",
    },
    health_potion_description: {
        en: "Restore %0 <semibold>health</semibold>.",
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
    power: {
        en: "Power",
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
    heal: {
        en: "Heal",
    },
    bash: {
        en: "Bash",
    },
    resource: {
        en: "Resource",
    },
    currency: {
        en: "Currency",
    },
    job: {
        en: "Job",
    },
    primary: {
        en: "Primary",
    },
    secondary: {
        en: "Secondary",
    },
    thief: {
        en: "Thief",
    },
    elementalist: {
        en: "Elementalist",
    },
    warrior: {
        en: "Warrior",
    },
    cleric: {
        en: "Cleric",
    },
    magnum_break: {
        en: "Magnum Break",
    },
    sword_mastery: {
        en: "Sword Mastery",
    },
    axe_mastery: {
        en: "Axe Mastery",
    },
    berserk: {
        en: "Berserk",
    },
    poison: {
        en: "Poison",
    },
    axe: {
        en: "Axe",
    },
    sword: {
        en: "Sword",
    },
    equipment: {
        en: "Equipment",
    },
    passive: {
        en: "Passive",
    },
    instant: {
        en: "Instant",
    },
    rank: {
        en: "Rank",
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
