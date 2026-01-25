import {
  Theme,
  trackEvents,
  trackLoad
} from "./chunk-KIBFX2PK.js";

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
  document.querySelector("[data-hide-i18n]").innerHTML = window.easter_egg[lang];
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
    trackEvents({
      event_type: "change_language",
      event_data: "language_toggle",
      previous_value: this.language ?? (getLanguage() || DEFAULT_LANG),
      new_value: value
    });
    this.language = value;
    document.documentElement.lang = value;
    const path = location.pathname.split("/").filter(Boolean);
    if (Object.keys(LANGUAGES).includes(path[0])) path.shift();
    if (value != DEFAULT_LANG) path.unshift(value);
    const search = location.search;
    history.pushState({}, "", "/" + path.join("/") + search);
    loadLanguage(value);
  }
  disconnectedCallback() {
    this.select.removeEventListener("change");
  }
};

// httpdocs/modules/devtools.js
var open = false;
var threshold = 170;
var checkDevtools = () => {
  const widthThreshold = window.outerWidth - window.innerWidth > threshold;
  const heightThreshold = window.outerHeight - window.innerHeight > threshold;
  const orientation = widthThreshold ? "vertical" : "horizontal";
  if (widthThreshold || heightThreshold) {
    if (!open) {
      open = true;
      window.dispatchEvent(
        new CustomEvent("devtoolsOpened", {
          detail: { orientation }
        })
      );
    }
  } else {
    open = false;
  }
};
setInterval(checkDevtools, 500);

// httpdocs/modules/greet.js
var RAINBOW = ["#ff0000", "#ffff00", "#00ff00", "#00ffff"];
var GREETING = {
  gl: [
    " \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588                                   \u2588\u2588\u2588      \u2588\u2588\u2588\u2588\u2588                      \u2588\u2588\u2588          ",
    "\u2591\u2591\u2588\u2588\u2588\u2591\u2591\u2591\u2591\u2591\u2588\u2588\u2588                                 \u2591\u2591\u2591      \u2591\u2591\u2588\u2588\u2588                     \u2588\u2588\u2588\u2591           ",
    " \u2591\u2588\u2588\u2588    \u2591\u2588\u2588\u2588  \u2588\u2588\u2588\u2588\u2588\u2588  \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588   \u2588\u2588\u2588\u2588\u2588 \u2588\u2588\u2588\u2588\u2588 \u2588\u2588\u2588\u2588   \u2588\u2588\u2588\u2588\u2588\u2588\u2588   \u2588\u2588\u2588\u2588\u2588\u2588          \u2588\u2588\u2588\u2591     \u2588\u2588\u2588\u2588\u2588\u2588  ",
    " \u2591\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588  \u2588\u2588\u2588\u2591\u2591\u2588\u2588\u2588\u2591\u2591\u2588\u2588\u2588\u2591\u2591\u2588\u2588\u2588 \u2591\u2591\u2588\u2588\u2588 \u2591\u2591\u2588\u2588\u2588 \u2591\u2591\u2588\u2588\u2588  \u2588\u2588\u2588\u2591\u2591\u2588\u2588\u2588  \u2588\u2588\u2588\u2591\u2591\u2588\u2588\u2588       \u2588\u2588\u2588\u2591      \u2591\u2591\u2591\u2591\u2591\u2588\u2588\u2588 ",
    " \u2591\u2588\u2588\u2588\u2591\u2591\u2591\u2591\u2591\u2588\u2588\u2588\u2591\u2588\u2588\u2588\u2588\u2588\u2588\u2588  \u2591\u2588\u2588\u2588 \u2591\u2588\u2588\u2588  \u2591\u2588\u2588\u2588  \u2591\u2588\u2588\u2588  \u2591\u2588\u2588\u2588 \u2591\u2588\u2588\u2588 \u2591\u2588\u2588\u2588 \u2591\u2588\u2588\u2588 \u2591\u2588\u2588\u2588     \u2588\u2588\u2588\u2591         \u2588\u2588\u2588\u2588\u2588\u2588\u2588 ",
    " \u2591\u2588\u2588\u2588    \u2591\u2588\u2588\u2588\u2591\u2588\u2588\u2588\u2591\u2591\u2591   \u2591\u2588\u2588\u2588 \u2591\u2588\u2588\u2588  \u2591\u2591\u2588\u2588\u2588 \u2588\u2588\u2588   \u2591\u2588\u2588\u2588 \u2591\u2588\u2588\u2588 \u2591\u2588\u2588\u2588 \u2591\u2588\u2588\u2588 \u2591\u2588\u2588\u2588   \u2588\u2588\u2588\u2591          \u2588\u2588\u2588\u2591\u2591\u2588\u2588\u2588 ",
    " \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 \u2591\u2591\u2588\u2588\u2588\u2588\u2588\u2588  \u2588\u2588\u2588\u2588 \u2588\u2588\u2588\u2588\u2588  \u2591\u2591\u2588\u2588\u2588\u2588\u2588    \u2588\u2588\u2588\u2588\u2588\u2591\u2591\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2591\u2591\u2588\u2588\u2588\u2588\u2588\u2588  \u2588\u2588\u2588\u2591           \u2591\u2591\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588",
    "\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591   \u2591\u2591\u2591\u2591\u2591\u2591  \u2591\u2591\u2591\u2591 \u2591\u2591\u2591\u2591\u2591    \u2591\u2591\u2591\u2591\u2591    \u2591\u2591\u2591\u2591\u2591  \u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591  \u2591\u2591\u2591\u2591\u2591\u2591  \u2591\u2591\u2591              \u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591 "
  ],
  es: [
    " \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588   \u2588\u2588\u2588                                                       \u2588\u2588\u2588      \u2588\u2588\u2588\u2588\u2588                      \u2588\u2588\u2588          ",
    "\u2591\u2591\u2588\u2588\u2588\u2591\u2591\u2591\u2591\u2591\u2588\u2588\u2588 \u2591\u2591\u2591                                                       \u2591\u2591\u2591      \u2591\u2591\u2588\u2588\u2588                     \u2588\u2588\u2588\u2591           ",
    " \u2591\u2588\u2588\u2588    \u2591\u2588\u2588\u2588 \u2588\u2588\u2588\u2588   \u2588\u2588\u2588\u2588\u2588\u2588  \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588   \u2588\u2588\u2588\u2588\u2588 \u2588\u2588\u2588\u2588\u2588  \u2588\u2588\u2588\u2588\u2588\u2588  \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588   \u2588\u2588\u2588\u2588   \u2588\u2588\u2588\u2588\u2588\u2588\u2588   \u2588\u2588\u2588\u2588\u2588\u2588          \u2588\u2588\u2588\u2591     \u2588\u2588\u2588\u2588\u2588\u2588  ",
    " \u2591\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 \u2591\u2591\u2588\u2588\u2588  \u2588\u2588\u2588\u2591\u2591\u2588\u2588\u2588\u2591\u2591\u2588\u2588\u2588\u2591\u2591\u2588\u2588\u2588 \u2591\u2591\u2588\u2588\u2588 \u2591\u2591\u2588\u2588\u2588  \u2588\u2588\u2588\u2591\u2591\u2588\u2588\u2588\u2591\u2591\u2588\u2588\u2588\u2591\u2591\u2588\u2588\u2588 \u2591\u2591\u2588\u2588\u2588  \u2588\u2588\u2588\u2591\u2591\u2588\u2588\u2588  \u2588\u2588\u2588\u2591\u2591\u2588\u2588\u2588       \u2588\u2588\u2588\u2591      \u2591\u2591\u2591\u2591\u2591\u2588\u2588\u2588 ",
    " \u2591\u2588\u2588\u2588\u2591\u2591\u2591\u2591\u2591\u2588\u2588\u2588 \u2591\u2588\u2588\u2588 \u2591\u2588\u2588\u2588\u2588\u2588\u2588\u2588  \u2591\u2588\u2588\u2588 \u2591\u2588\u2588\u2588  \u2591\u2588\u2588\u2588  \u2591\u2588\u2588\u2588 \u2591\u2588\u2588\u2588\u2588\u2588\u2588\u2588  \u2591\u2588\u2588\u2588 \u2591\u2588\u2588\u2588  \u2591\u2588\u2588\u2588 \u2591\u2588\u2588\u2588 \u2591\u2588\u2588\u2588 \u2591\u2588\u2588\u2588 \u2591\u2588\u2588\u2588     \u2588\u2588\u2588\u2591         \u2588\u2588\u2588\u2588\u2588\u2588\u2588 ",
    " \u2591\u2588\u2588\u2588    \u2591\u2588\u2588\u2588 \u2591\u2588\u2588\u2588 \u2591\u2588\u2588\u2588\u2591\u2591\u2591   \u2591\u2588\u2588\u2588 \u2591\u2588\u2588\u2588  \u2591\u2591\u2588\u2588\u2588 \u2588\u2588\u2588  \u2591\u2588\u2588\u2588\u2591\u2591\u2591   \u2591\u2588\u2588\u2588 \u2591\u2588\u2588\u2588  \u2591\u2588\u2588\u2588 \u2591\u2588\u2588\u2588 \u2591\u2588\u2588\u2588 \u2591\u2588\u2588\u2588 \u2591\u2588\u2588\u2588   \u2588\u2588\u2588\u2591          \u2588\u2588\u2588\u2591\u2591\u2588\u2588\u2588 ",
    " \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588  \u2588\u2588\u2588\u2588\u2588\u2591\u2591\u2588\u2588\u2588\u2588\u2588\u2588  \u2588\u2588\u2588\u2588 \u2588\u2588\u2588\u2588\u2588  \u2591\u2591\u2588\u2588\u2588\u2588\u2588   \u2591\u2591\u2588\u2588\u2588\u2588\u2588\u2588  \u2588\u2588\u2588\u2588 \u2588\u2588\u2588\u2588\u2588 \u2588\u2588\u2588\u2588\u2588\u2591\u2591\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2591\u2591\u2588\u2588\u2588\u2588\u2588\u2588  \u2588\u2588\u2588\u2591           \u2591\u2591\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588",
    "\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591  \u2591\u2591\u2591\u2591\u2591  \u2591\u2591\u2591\u2591\u2591\u2591  \u2591\u2591\u2591\u2591 \u2591\u2591\u2591\u2591\u2591    \u2591\u2591\u2591\u2591\u2591     \u2591\u2591\u2591\u2591\u2591\u2591  \u2591\u2591\u2591\u2591 \u2591\u2591\u2591\u2591\u2591 \u2591\u2591\u2591\u2591\u2591  \u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591  \u2591\u2591\u2591\u2591\u2591\u2591  \u2591\u2591\u2591              \u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591 "
  ],
  en: [
    " \u2588\u2588\u2588\u2588\u2588   \u2588\u2588\u2588   \u2588\u2588\u2588\u2588\u2588          \u2588\u2588\u2588\u2588                                            ",
    "\u2591\u2591\u2588\u2588\u2588   \u2591\u2588\u2588\u2588  \u2591\u2591\u2588\u2588\u2588          \u2591\u2591\u2588\u2588\u2588                                            ",
    " \u2591\u2588\u2588\u2588   \u2591\u2588\u2588\u2588   \u2591\u2588\u2588\u2588   \u2588\u2588\u2588\u2588\u2588\u2588  \u2591\u2588\u2588\u2588   \u2588\u2588\u2588\u2588\u2588\u2588   \u2588\u2588\u2588\u2588\u2588\u2588  \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588    \u2588\u2588\u2588\u2588\u2588\u2588 ",
    " \u2591\u2588\u2588\u2588   \u2591\u2588\u2588\u2588   \u2591\u2588\u2588\u2588  \u2588\u2588\u2588\u2591\u2591\u2588\u2588\u2588 \u2591\u2588\u2588\u2588  \u2588\u2588\u2588\u2591\u2591\u2588\u2588\u2588 \u2588\u2588\u2588\u2591\u2591\u2588\u2588\u2588\u2591\u2591\u2588\u2588\u2588\u2591\u2591\u2588\u2588\u2588\u2591\u2591\u2588\u2588\u2588  \u2588\u2588\u2588\u2591\u2591\u2588\u2588\u2588",
    " \u2591\u2591\u2588\u2588\u2588  \u2588\u2588\u2588\u2588\u2588  \u2588\u2588\u2588  \u2591\u2588\u2588\u2588\u2588\u2588\u2588\u2588  \u2591\u2588\u2588\u2588 \u2591\u2588\u2588\u2588 \u2591\u2591\u2591 \u2591\u2588\u2588\u2588 \u2591\u2588\u2588\u2588 \u2591\u2588\u2588\u2588 \u2591\u2588\u2588\u2588 \u2591\u2588\u2588\u2588 \u2591\u2588\u2588\u2588\u2588\u2588\u2588\u2588 ",
    "  \u2591\u2591\u2591\u2588\u2588\u2588\u2588\u2588\u2591\u2588\u2588\u2588\u2588\u2588\u2591   \u2591\u2588\u2588\u2588\u2591\u2591\u2591   \u2591\u2588\u2588\u2588 \u2591\u2588\u2588\u2588  \u2588\u2588\u2588\u2591\u2588\u2588\u2588 \u2591\u2588\u2588\u2588 \u2591\u2588\u2588\u2588 \u2591\u2588\u2588\u2588 \u2591\u2588\u2588\u2588 \u2591\u2588\u2588\u2588\u2591\u2591\u2591  ",
    "    \u2591\u2591\u2588\u2588\u2588 \u2591\u2591\u2588\u2588\u2588     \u2591\u2591\u2588\u2588\u2588\u2588\u2588\u2588  \u2588\u2588\u2588\u2588\u2588\u2591\u2591\u2588\u2588\u2588\u2588\u2588\u2588 \u2591\u2591\u2588\u2588\u2588\u2588\u2588\u2588  \u2588\u2588\u2588\u2588\u2588\u2591\u2588\u2588\u2588 \u2588\u2588\u2588\u2588\u2588\u2591\u2591\u2588\u2588\u2588\u2588\u2588\u2588 ",
    "     \u2591\u2591\u2591   \u2591\u2591\u2591       \u2591\u2591\u2591\u2591\u2591\u2591  \u2591\u2591\u2591\u2591\u2591  \u2591\u2591\u2591\u2591\u2591\u2591   \u2591\u2591\u2591\u2591\u2591\u2591  \u2591\u2591\u2591\u2591\u2591 \u2591\u2591\u2591 \u2591\u2591\u2591\u2591\u2591  \u2591\u2591\u2591\u2591\u2591\u2591  "
  ]
};
var WELCOME = {
  gl: `
Supo\xF1o que se has chegado hasta aqu\xED e por alg\xFAn enlace no meu curr\xEDculum, gracias por quedarte e
seguir a investigar.

Esta e unha sencilla p\xE1xina a modo de presentaci\xF3n, feita con JavaScript vainilla utilizando
funcionalidades modernas como os web components.

Despliegase con Netlify e ten asociadas un par de funci\xF3ns que se executan durante a carga da p\xE1xina, que
me permiten traquear as visitas, gardar un historial en Google Sheets e recibir unha notificaci\xF3n a
trav\xE9s do Telegram.

O c\xF3digo fonte de este sitio  https://github.com/adecora/alejandrodecora.es \xE9 libre baixo licencia AGPL 3.0.

PD: Xa que estas aqu\xED, podes seguir inspeccionando o c\xF3digo na pestana "Elements" \u{1F9D0}.`,
  es: `
Supongo que si has llegado hasta aqu\xED es por alg\xFAn enlace en mi curr\xEDculum, gracias por quedarte y
seguir investigando.

Esta es una p\xE1gina sencilla a modo de presentaci\xF3n, hecha con JavaScript vainilla utilizando
funcionalidades modernas como los web components.

Se despliega con Netlify y tiene asociadas un par de funciones que se se ejecutan durante la carga de
la p\xE1gina, que me permiten traquear las visitas, guardar un historial en Google Sheets y recibir una
notificaci\xF3n a trav\xE9s de Telegram.

El c\xF3digo fuente de este sitio https://github.com/adecora/alejandrodecora.es es libre bajo licencia AGPL 3.0.

PD: Ya que estas aqu\xED, puedes seguir inspeccionando el c\xF3digo en la pesta\xF1a "Elements" \u{1F9D0}.`,
  en: `
I guess if you've made it here, it\u2019s because you found a link on my curriculum. Thanks for sticking around and
taking a look.

This is a simple landing page made with vanilla JavaScript, using modern features like web components.

It\u2019s deployed on Netlify and has a couple of functions that run during page load, allowing me to track visits,
save a history to Google Sheets, and send myself a notification via Telegram.

The source code for this site https://github.com/adecora/alejandrodecora.es is open under the AGPL 3.0 license.

PS: Since you\u2019re here, feel free to keep inspecting the code in the \u201CElements\u201D tab \u{1F9D0}.`
};
window.easter_egg = {
  gl: `
Graci\xF1as por leer o meu curr\xEDculum e chegar hasta aqu\xED. Podes
<a href="mailto:alejandrodecora@gmail.com?subject=Bom curr\xEDculum&body=\xA1Contratado! Comezas a primeiros do vindeiro mes.">contactarme \u{1F4EC}</a>
, esperoche \u{1F61A}. <img src="images/esperando.webp" alt="Esperando tranquilamente no parque" width="100" height="200" />`,
  es: `
Gracias por leer mi curr\xEDculum y llegar hasta aqu\xED. Puedes
<a href="mailto:alejandrodecora@gmail.com?subject=Muy buen curr\xEDculum&body=\xA1Contratado! Empiezas a principios del pr\xF3ximo mes.">contactarme \u{1F4EC}</a>
, te espero \u{1F61A}.<img src="images/esperando.webp" alt="Esperando tranquilamente en el parque" width="100" height="200" />`,
  en: `
Thanks for reading my curriculum and making it this far. You can
<a href="mailto:alejandrodecora@gmail.com?subject=Awesome curriculum&body=You're hired! You start at the beginning of next month.">reach out \u{1F4EC}</a>
, I\u2019ll be waiting \u{1F61A}. <img src="images/esperando.webp" alt="Chilling at the park while waiting" width="100" height="200" />`
};
document.addEventListener("DOMContentLoaded", () => {
  const lang = document.documentElement.lang;
  GREETING[lang].forEach((line, i) => {
    let color = RAINBOW[i % RAINBOW.length];
    console.log(`%c${line}`, `color: ${color}; font-family: monospace;`);
  });
  console.log(WELCOME[lang]);
});

// httpdocs/app.js
document.addEventListener("DOMContentLoaded", trackLoad);
window.addEventListener("devtoolsOpened", ({ detail: { orientation } }) => {
  trackEvents({
    event_type: "devtools_open",
    event_data: `${orientation} easter egg journey`
  });
});
customElements.define("x-select", Select);
customElements.define("x-theme", Theme);
