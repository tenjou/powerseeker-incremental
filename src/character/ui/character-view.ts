import { getElement } from "../../dom"
import { subscribe } from "../../events"
import "./character-attributes"
import { CharacterAttributes } from "./character-attributes"
import "./character-equipment"
import { CharacterEquipment } from "./character-equipment"
import "./character-info"
import { CharacterInfo } from "./character-info"
import "./character-powers"
import { CharacterPowers } from "./character-powers"
import "./character-resistances"
import { CharacterResistances } from "./character-resistances"
import "./stats-row"

export function loadCharacterView() {
    updateCharacterInfo()
    updateCharacterAttributes()

    getElement<CharacterEquipment>("character-equipment").update()

    subscribe("exp-updated", updateCharacterInfo)
    subscribe("sp-updated", updateCharacterInfo)
    subscribe("attributes-updated", updateCharacterAttributes)

    // subscribe("equip", updateEquipmentSlot)
    // subscribe("unequip", updateEquipmentSlot)
    // updateCharacterView()
}

const updateCharacterInfo = () => {
    getElement<CharacterInfo>("character-info").update()
}

const updateCharacterAttributes = () => {
    getElement<CharacterAttributes>("character-attributes").update()
    getElement<CharacterPowers>("character-powers").update()
    getElement<CharacterResistances>("character-resistances").update()
}

export function unloadCharacterView() {}
