const LANGUAGES = {
  gl: "Gallego",
  es: "Español",
  en: "English",
}
// Lenguaje por defecto, tiene que estar alineado con el que aparece en el `index.html`
const DEFAULT_LANG = "gl"

function getLanguage() {
  const path = location.pathname.split("/")[1]
  return Object.keys(LANGUAGES).includes(path) ? path : null
}

async function loadLanguage(lang) {
  const request = await fetch(`lang/${lang}.json`)
  const content = await request.json()

  for (const [key, value] of Object.entries(content)) {
    let element = document.querySelector(`[data-i18n="${key}"]`)
    element.style.opacity = 0

    // Este *timeout* tiene que durar lo mismo que la transición en `body main section p`
    setTimeout(() => {
      element.textContent = value
      element.style.opacity = 1
    }, 400)
  }
}

function setLanguage(lang) {
  const pathname = location.pathname
}

class Select extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: "open" })
    const styles = `
      select,
      ::picker(select) {
        appearance: base-select;
        background: transparent;
        cursor: pointer;
      }

      select {
        border: 0px solid #ddd;
        background: transparent;
        color: var(--color);
        padding: var(--x-pad);
        transition: 0.4s;
      }

      select:hover,
      select:focus {
        background: var(--selection-background);
      }

      select::picker-icon {
        position: relative;
        top: -5px;
        font-weight: bold;
        content: "⌵";
        color: var(--color);
        transition: 0.4s rotate;
      }

      select:open::picker-icon {
        top: 5px;
        rotate: 180deg;
      }

      ::picker(select) {
        border: none;
      }

      selectedcontent {
        text-transform: uppercase;
        font-weight: bold;
      }

      option {
        display: flex;
        justify-content: flex-start;
        gap: 5px;
        color: var(--color);
        background: var(--color-background);
        padding: 10px;
        transition: 0.4s;
      }

      option:hover,
      option:focus {
        background: var(--selection-background);
      }

      option:checked {
        font-weight: bold;
      }

      option::checkmark {
        order: 1;
        margin-left: auto;
        content: "🗣️";
      }

      ::picker(select) {
        opacity: 0;
        transition: all 0.4s allow-discrete;
      }

      ::picker(select):popover-open {
        opacity: 1;
      }

      @starting-style {
        ::picker(select):popover-open {
          opacity: 0;
        }
      }

      ::picker(select) {
        top: calc(anchor(bottom) + 1px);
        right: anchor(110%);
      }

      @media (max-width: 1024px) {
        ::picker(select) {
          top: calc(anchor(bottom) + 1px);
          left: anchor(0%);
        }
      }
    `
    const stylesheet = new CSSStyleSheet()
    stylesheet.replace(styles)
    this.shadowRoot.adoptedStyleSheets = [
      ...document.adoptedStyleSheets,
      stylesheet,
    ]
  }

  select
  selectedContent

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <select id="language-select" aria-label="Set language">
          <button>
              <selectedcontent></selectedcontent>
          </button>
          ${Object.entries(LANGUAGES)
            .map(([lang, value]) => `<option value=${lang}>${value}</option>`)
            .join(" ")}
      </select>
    `
    this.select = this.shadowRoot.querySelector("#language-select")
    this.selectedContent = this.shadowRoot.querySelector("selectedcontent")

    const language = getLanguage() || DEFAULT_LANG
    if (language !== DEFAULT_LANG) {
      this.select.value = language
      this.lang = language
    }

    this.selectedContent &&
      (this.selectedContent.textContent = this.select.value)

    this.select.addEventListener("change", (event) => {
      this.lang = event.target.value
      this.selectedContent &&
        (this.selectedContent.textContent = this.select.value)
    })
  }

  get lang() {
    return this.language ?? ""
  }

  set lang(value) {
    this.language = value
    document.documentElement.lang = value

    const path = location.pathname.split("/").filter(Boolean)
    if (Object.keys(LANGUAGES).includes(path[0])) path.shift()
    if (value != DEFAULT_LANG) path.unshift(value)
    const search = location.search

    history.pushState({}, "", "/" + path.join("/") + search)
    loadLanguage(value)
  }

  disconnectedCallback() {
    this.select.removeEventListener("change")
  }
}

export { Select }
