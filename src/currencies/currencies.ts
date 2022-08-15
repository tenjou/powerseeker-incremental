import { emit } from "../events"
import { getState } from "../state"
import { CurrencyType } from "./currency-types"

export function addCurrency(currencyType: CurrencyType, value: number) {
    const { currencies } = getState()

    currencies[currencyType] += value

    emit("currency-updated", currencyType)
}

export function removeCurrency(currencyType: CurrencyType, value: number) {
    const { currencies } = getState()

    currencies[currencyType] -= value

    emit("currency-updated", currencyType)
}

export function haveCurrency(currencyType: CurrencyType, needValue: number = 1) {
    const { currencies } = getState()

    const currency = currencies[currencyType]

    return currency >= needValue
}
