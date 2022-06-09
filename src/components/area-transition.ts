import { HTMLComponent } from "../dom"

const template = document.createElement("template")
template.innerHTML = html`<style>
    @keyframes anim {
        0% {
            opacity: 1;
        }
        100% {
            opacity: 0;
        }
    }

    :host {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        top: 0%;
        left: 0%;
        width: 100%;
        height: 100%;
        background: #444;
        opacity: 0;
        pointer-events: none;

        animation-name: anim;
        animation-duration: 0.8s;
        animation-iteration-count: 1;
        animation-timing-function: ease-out;
        animation-fill-mode: forwards;
    }
</style>`

class AreaTransition extends HTMLComponent {
    constructor() {
        super(template)
    }
}

customElements.define("area-transition", AreaTransition)
