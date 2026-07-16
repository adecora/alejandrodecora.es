import { Select } from "./components/selector.js"
import { Theme } from "./components/theme.js"
import "./modules/devtools.js"
import "./modules/greet.js"
import { trackEvents, trackLoad } from "./modules/track.js"

document.addEventListener("DOMContentLoaded", trackLoad)
window.addEventListener("devtoolsOpened", ({ detail: { orientation } }) => {
  trackEvents({
    event_type: "devtools_open",
    event_data: `${orientation} easter egg journey`,
  })
})
document.getElementById("cv").addEventListener("click", () => {
  const queryParams = new URLSearchParams(location.search)
  const name = queryParams.get("👀") || "unknown"

  trackEvents({
    event_type: "open_cv",
    event_data: `CV opened from ${location.pathname}`,
    new_value: `${name}`,
  })
})

customElements.define("x-select", Select)
customElements.define("x-theme", Theme)
