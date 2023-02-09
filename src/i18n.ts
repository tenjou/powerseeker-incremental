interface LocalEntry {
    en: string
}

type Languages = "en"

const lang: Languages = "en"

const I18nValues = {
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
    weight: {
        en: "Weight",
    },
    xp: {
        en: "Experience",
    },
    xp_description: {
        en: "Experience is gained by defeating enemies. Gaining experience levels up your character.",
    },
    health: {
        en: "Health",
    },
    mana: {
        en: "Mana",
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
    forest: {
        en: "Forest",
    },
    forest_description: {
        en: "A forest is a place where you can find resources, and fight enemies.",
    },
    desert: {
        en: "Desert",
    },
    desert_description: {
        en: "A desert is a place where you can find resources, and fight enemies.",
    },
    town: {
        en: "Town",
    },
    town_description: {
        en: "A town is a place where you can buy and sell items, and talk to NPCs.",
    },
    fight: {
        en: "Fight",
    },
    treasure: {
        en: "Treasure",
    },
    continue: {
        en: "Continue",
    },
    common: {
        en: "Common",
    },
    uncommon: {
        en: "Uncommon",
    },
    rare: {
        en: "Rare",
    },
    epic: {
        en: "Epic",
    },
    legendary: {
        en: "Legendary",
    },
    level_up: {
        en: "Level Up",
    },
    healing: {
        en: "Healing",
    },
    aggro: {
        en: "Aggro",
    },
    health_regen: {
        en: "Health Regen",
    },
    mana_regen: {
        en: "Mana Regen",
    },
    increase_fire_damage: {
        en: "Increase Fire Damage",
    },
    increase_water_damage: {
        en: "Increase Water Damage",
    },
    increase_earth_damage: {
        en: "Increase Earth Damage",
    },
    increase_wind_damage: {
        en: "Increase Wind Damage",
    },
    copper_ore_description: {
        en: "A common ore found in the forest.",
    },
    carp_description: {
        en: "A common fish found in the forest.",
    },
    maple_log_description: {
        en: "A common wood found in the forest.",
    },
    leather_clothing_description: {
        en: "A common clothing found in the forest.",
    },
    gold_description: {
        en: "Gold coins are often found as loot after defeating enemies, and can also be earned by completing quests or selling items to merchants.",
    },
    axe_description: {
        en: "An axe is a powerful weapon and tool that can be wielded one or two-handed.",
    },
    sword_description: {
        en: "A common weapon found in the forest.",
    },
    amount: {
        en: "Amount",
    },
    battle: {
        en: "Battle",
    },
    copper_mine: {
        en: "Copper Mine",
    },
} satisfies Record<string, LocalEntry>

export function i18n(key: string | null) {
    if (!key) {
        return "undefined"
    }

    const entry = I18nValues[key]
    if (!entry) {
        return `__${key}__`
    }
    return entry[lang]
}
