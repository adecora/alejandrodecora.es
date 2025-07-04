class Theme extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: "open" })
    const styles = `
      input[type="checkbox"] {
        -webkit-appearance: none;
        appearance: none;
        cursor: pointer;
        position: relative;
        top: var(--x-pad);
        font-size: 1em;
        width: 2.5em;
        height: 1.5em;
        border-radius: 1em;
        border: 1px solid black;
        background: var(--toggle-background);
        transition: all 0.4s;
      }

      input[type="checkbox"]::before {
        content: "🌞";
        font-size: 2em;
        position: absolute;
        top: -35%;
        left: -35%;
        transition: all 0.4s;
      }

      input[type="checkbox"]:checked {
        transition: all 0.4s;
      }

      input[type="checkbox"]:checked::before {
        content: "🌚";
        transform: translateX(2ch);
        transition: all 0.4s;
      }

      input:focus {
        outline: 2px dotted black;
        box-shadow: 0 0 5px black;
      }
    `
    const stylesheet = new CSSStyleSheet()
    stylesheet.replace(styles)
    this.shadowRoot.adoptedStyleSheets = [
      ...document.adoptedStyleSheets,
      stylesheet,
    ]
  }

  input

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <input type="checkbox" name="theme" id="theme" aria-label="Set theme" />
    `
    this.input = this.shadowRoot.querySelector('input[type="checkbox"]')

    const theme = localStorage.getItem("theme")
    if (theme === "dark-theme") {
      this.input.checked = true
      document.body.classList.add("dark-theme")
    }

    this.input.addEventListener("change", () => {
      if (this.input.checked) {
        document.body.classList.add("dark-theme")
        localStorage.setItem("theme", "dark-theme")
      } else {
        document.body.classList.remove("dark-theme")
        localStorage.setItem("theme", "light-theme")
      }
    })
  }

  disconnectedCallback() {
    this.input.removeEventListener("change")
  }
}

export { Theme }
