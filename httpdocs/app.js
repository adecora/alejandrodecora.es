import { Select } from "./components/selector.js"
import { Theme } from "./components/theme.js"

async function loadLanguage(lang) {
  const request = await fetch(`lang/${lang}.json`)
  const content = await request.json()
  console.log(content)

  for (const [key, value] of Object.entries(content)) {
    let element = document.querySelector(`[data-i18n="${key}"]`)
    element.textContent = value
  }
}

// const selector = document.querySelector("select")
// selector.addEventListener("change", (event) => {
//   loadLanguage(event.target.value)
//   document.documentElement.lang = event.target.value
// })

// const themeButton = document.querySelector("nav button")
// themeButton.addEventListener("click", () => {
//   document.body.classList.toggle("dark-mode")
// })
;(function () {
  const select = document.querySelector("select")
  const selectedContent = document.querySelector("selectedcontent")

  selectedContent &&
    (selectedContent.textContent = select.options[select.selectedIndex].value)

  select.addEventListener("change", () => {
    selectedContent &&
      (selectedContent.textContent = select.options[select.selectedIndex].value)
  })
})

console.log(location.pathname.split("/")[1])

customElements.define("x-select", Select)
customElements.define("x-theme", Theme)
