import { i18n } from "../i18n"

export function getRarityText(rarity: number) {
    switch (rarity) {
        case 0:
            return i18n("common")
        case 1:
            return i18n("uncommon")
        case 2:
            return i18n("rare")
        case 3:
            return i18n("epic")
        case 4:
            return i18n("legendary")
        default:
            throw new Error("Invalid rarity: " + rarity)
    }
}
