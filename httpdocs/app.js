import { Select } from "./components/selector.js"
import { Theme } from "./components/theme.js"
import "./modules/greet.js"
import track from "./modules/track.js"

document.addEventListener("DOMContentLoaded", track)

customElements.define("x-select", Select)
customElements.define("x-theme", Theme)
