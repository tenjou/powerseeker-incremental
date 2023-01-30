// import { LocationConfigs, LocationId } from "../../config/location-config"
// import { getElementById, removeAllChildren, removeElement } from "../../dom"
// import { subscribe } from "../../events"
// import { openPopup } from "../../popup"
// import { getState } from "../../state"
// import { ExplorationState } from "../../world/world-types"
// import { ExplorationService } from "../exploration-service"
// import "./entity-card"
// import "./explore-popup"
// import { ExplorePopup } from "./explore-popup"
// import "./location-card"

// export function loadWorldView() {
//     const { exploration } = getState()

//     const worldParent = getElementById("world")
//     const locationContainer = getElementById("location-container")

//     // const forestBattle = document.createElement("x-button")
//     // forestBattle.setAttribute("class", "black")
//     // forestBattle.innerHTML = "Forest Battle"
//     // forestBattle.onclick = () => startBattle("test_battle")
//     // worldParent.appendChild(forestBattle)

//     for (const locationId in LocationConfigs) {
//         const location = ExplorationService.get(locationId as LocationId)
//         const element = document.createElement("location-card")
//         element.id = `location-${locationId}`
//         if (location) {
//             element.setAttribute("location", locationId)
//         }
//         locationContainer.appendChild(element)
//     }

//     // subscribe("location-updated", update)
//     // subscribe("location-removed", remove)

//     subscribe("exploration-started", updatePopup)
//     subscribe("exploration-ended", updatePopup)

//     if (exploration) {
//         openExplorationPopup(exploration)
//     }
// }

// export function unloadWorldView() {
//     removeAllChildren("world")
//     removeAllChildren("location-container")

//     // unsubscribe("location-updated", update)
//     // unsubscribe("location-removed", remove)
// }

// function updatePopup() {
//     const popup = getElementById("explore-popup") as ExplorePopup
//     popup.update()
// }

// // function update(locationId: LocationId) {
// //     const location = ExplorationService.get(locationId)
// //     if (!location) {
// //         console.error(`Missing location: ${locationId}`)
// //         return
// //     }

// //     const element = getElement(`location-${locationId}`) as LocationCard
// //     element.update()

// //     const parent = getElement("entities-container")
// //     const missingEntities = location.entities.length - parent.children.length

// //     for (let n = 0; n < missingEntities; n += 1) {
// //         const entityCard = document.createElement("entity-card")
// //         parent.appendChild(entityCard)
// //     }

// //     for (let n = 0; n < location.entities.length; n += 1) {
// //         const entity = location.entities[n]
// //         const entityCard = parent.children[n] as EntityCard
// //         entityCard.id = `entity-${entity.uid}`
// //         entityCard.update(entity)
// //     }
// // }

// function remove(uid: number) {
//     removeElement(`entity-${uid}`)
// }

// export function openExplorationPopup(exploration: ExplorationState) {
//     openPopup("explore-popup", {
//         id: "explore-popup",
//     })
// }
