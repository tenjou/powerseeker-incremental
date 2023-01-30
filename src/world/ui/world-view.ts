import { AreaConfigs, AreaId } from "../../config/area-configs"
import { openPopup } from "../../popup"
import { getState, updateState } from "../../state"
import { BattleResultElement } from "./../../battle/ui/battle-result"
import { getElement, getElementById, removeAllChildren, setText } from "./../../dom"
import { subscribe, unsubscribe } from "./../../events"
import { LootService } from "./../../inventory/loot-service"
import { WorldService } from "./../world-service"
import "./explore-wilderness"
import { ExploreWilderness } from "./explore-wilderness"
import "./area-card"
import { AreaCard } from "./area-card"
import { i18n } from "./../../i18n"

export function loadWorldView(segments: string[]) {
    const parent = getElementById("view-world")
    const areaMenu = getElementById("area-menu", parent)

    for (const key in AreaConfigs) {
        const areaId = key as AreaId
        const locationCard = new AreaCard()
        locationCard.id = `area-${areaId}`
        locationCard.setAttribute("area", areaId)
        locationCard.onclick = () => WorldService.goToArea(areaId)
        areaMenu.appendChild(locationCard)
    }

    subscribe("area-updated", updateWorldView)
    // subscribe("exploration-started", updateExploration)
    // subscribe("exploration-ended", updateExploration)
    // subscribe("battle-ended", updateWorldView)

    // const areaId = segments[0] as AreaId
    // if (areaId) {
    //     WorldService.goToArea(areaId)
    // }

    updateWorldView()
    // updateExploration()
}

export function unloadWorldView() {
    removeAllChildren("world-container")
    unsubscribe("area-updated", updateWorldView)
    unsubscribe("exploration-started", updateExploration)
    unsubscribe("exploration-ended", updateExploration)
    unsubscribe("battle-ended", updateWorldView)
}

function updateWorldView() {
    const { battleResult } = getState()

    const parent = getElementById("view-world")

    const areaCards = parent.querySelectorAll<AreaCard>("area-card")
    areaCards.forEach((areaCard) => {
        const area = areaCard.getAttribute("area") as AreaId
        areaCard.toggleAttr("data-active", WorldService.isSelected(area))
    })

    if (battleResult) {
        openPopup("battle-result-popup", {}, () => {
            LootService.consumeBattleResult()
        })
    }

    const selectedAreaId = WorldService.getSelectedAreaId()
    setText("area-name", i18n(selectedAreaId))
    setText("area-description", i18n(`${selectedAreaId}_description`))

    // getElement<ExploreWilderness>("explore-wilderness").update(locationId)
}

const updateExploration = () => {
    const exploreWilderness = getElement<ExploreWilderness>("explore-wilderness")
    exploreWilderness.update()
}
