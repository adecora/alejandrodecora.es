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

const themeButton = document.querySelector("nav button")
themeButton.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode")
})

console.log(location.pathname.split("/")[1])
