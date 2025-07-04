// httpdocs/components/selector.js
var LANGUAGES = {
  gl: "Gallego",
  es: "Espa\xF1ol",
  en: "English"
};
var DEFAULT_LANG = "gl";
function getLanguage() {
  const path = location.pathname.split("/")[1];
  return Object.keys(LANGUAGES).includes(path) ? path : null;
}
async function loadLanguage(lang) {
  const request = await fetch(`lang/${lang}.json`);
  const content = await request.json();
  console.log(content);
  for (const [key, value] of Object.entries(content)) {
    let element = document.querySelector(`[data-i18n="${key}"]`);
    element.style.opacity = 0;
    setTimeout(() => {
      element.textContent = value;
      element.style.opacity = 1;
    }, 400);
  }
}
var Select = class extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
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
        content: "\u2335";
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
        content: "\u{1F5E3}\uFE0F";
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
    `;
    const stylesheet = new CSSStyleSheet();
    stylesheet.replace(styles);
    this.shadowRoot.adoptedStyleSheets = [
      ...document.adoptedStyleSheets,
      stylesheet
    ];
  }
  select;
  selectedContent;
  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <select id="language-select" aria-label="Set language">
          <button>
              <selectedcontent></selectedcontent>
          </button>
          ${Object.entries(LANGUAGES).map(([lang, value]) => `<option value=${lang}>${value}</option>`).join(" ")}
      </select>
    `;
    this.select = this.shadowRoot.querySelector("#language-select");
    this.selectedContent = this.shadowRoot.querySelector("selectedcontent");
    const language = getLanguage() || DEFAULT_LANG;
    if (language !== DEFAULT_LANG) {
      this.select.value = language;
      this.lang = language;
    }
    this.selectedContent && (this.selectedContent.textContent = this.select.value);
    this.select.addEventListener("change", (event) => {
      this.lang = event.target.value;
      this.selectedContent && (this.selectedContent.textContent = this.select.value);
    });
  }
  get lang() {
    return this.language ?? "";
  }
  set lang(value) {
    this.language = value;
    document.documentElement.lang = value;
    const path = location.pathname.split("/").filter(Boolean);
    if (Object.keys(LANGUAGES).includes(path[0])) path.shift();
    if (value != DEFAULT_LANG) path.unshift(value);
    history.pushState({}, "", "/" + path.join("/"));
    loadLanguage(value);
  }
  disconnectedCallback() {
    this.select.removeEventListener("change");
  }
};

// httpdocs/components/theme.js
var Theme = class extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
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
        content: "\u{1F31E}";
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
        content: "\u{1F31A}";
        transform: translateX(2ch);
        transition: all 0.4s;
      }

      input:focus {
        outline: 2px dotted black;
        box-shadow: 0 0 5px black;
      }
    `;
    const stylesheet = new CSSStyleSheet();
    stylesheet.replace(styles);
    this.shadowRoot.adoptedStyleSheets = [
      ...document.adoptedStyleSheets,
      stylesheet
    ];
  }
  input;
  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <input type="checkbox" name="theme" id="theme" aria-label="Set theme" />
    `;
    this.input = this.shadowRoot.querySelector('input[type="checkbox"]');
    const theme = localStorage.getItem("theme");
    if (theme === "dark-theme") {
      this.input.checked = true;
      document.body.classList.add("dark-theme");
    }
    this.input.addEventListener("change", () => {
      if (this.input.checked) {
        document.body.classList.add("dark-theme");
        localStorage.setItem("theme", "dark-theme");
      } else {
        document.body.classList.remove("dark-theme");
        localStorage.setItem("theme", "light-theme");
      }
    });
  }
  disconnectedCallback() {
    this.input.removeEventListener("change");
  }
};

// httpdocs/app.js
console.log(location.pathname.split("/")[1]);
customElements.define("x-select", Select);
customElements.define("x-theme", Theme);
