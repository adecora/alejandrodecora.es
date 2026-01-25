// httpdocs/modules/track.js
var trackingOn = null;
var FancyDate = class extends Date {
  constructor(...args) {
    super(...args);
  }
  toTinybird() {
    return this.toISOString().slice(0, 19).replace("T", " ");
  }
  toTelegram() {
    return this.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  }
};
async function trackData() {
  const queryParams = new URLSearchParams(location.search);
  const name = queryParams.get("\u{1F440}");
  const requestIP = await fetch("/.netlify/functions/ip");
  const { ip } = await requestIP.json();
  const requestGEO = await fetch("/geo");
  const { city, country } = await requestGEO.json();
  const theme = localStorage.getItem("theme");
  const timestamp = new FancyDate();
  const data = {
    name: name ?? "unknown",
    language: navigator.language ?? "unknown",
    useragent: navigator.userAgent ?? "unknown",
    theme: theme ?? "light-mode",
    ip: ip ?? "unknown",
    city: city ?? "unknown",
    code: country.code ?? "unknown",
    country: country.name ?? "unknown"
  };
  const msgUint8 = new TextEncoder().encode(JSON.stringify(data));
  const hashBuffer = await window.crypto.subtle.digest("SHA-1", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return [
    timestamp,
    {
      session_id: hashHex,
      ...data
    }
  ];
}
async function getTracking() {
  if (!trackingOn) {
    trackingOn = trackData();
  }
  return trackingOn;
}
async function trackLoad() {
  const [timestamp, data] = await getTracking();
  fetch("/.netlify/functions/log", {
    method: "POST",
    headers: {
      Accept: "application/json"
    },
    body: JSON.stringify({ timestamp: timestamp.toTinybird(), ...data })
  }).catch((error) => {
    console.error(`No se ha podido registrar la vista: ${error}`);
  });
  data.timestamp = timestamp.toTelegram();
  fetch("/.netlify/functions/notify", {
    method: "POST",
    headers: {
      Accept: "application/json"
    },
    body: JSON.stringify(
      { timestamp: timestamp.toTelegram(), ...data },
      ["timestamp", "useragent", "name", "usergent", "city"],
      "	"
    )
  }).catch((error) => {
    console.error(`No se ha podido notificar la vista: ${error}`);
  });
}
async function trackEvents({
  event_type,
  event_data = "unknown",
  previous_value = "unknown",
  new_value = "unknown"
}) {
  const [timestamp, { session_id }] = await getTracking();
  fetch("/.netlify/functions/event", {
    method: "POST",
    headers: {
      Accept: "application/json"
    },
    body: JSON.stringify({
      timestamp: timestamp.toTinybird(),
      session_id,
      event_type,
      event_data,
      previous_value,
      new_value
    })
  }).catch((error) => {
    console.error(`No se ha podido registrar la vista: ${error}`);
  });
}

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
      let [previous_value, new_value] = ["light-theme", "dark-theme"];
      if (!this.input.checked)
        [previous_value, new_value] = ["dark-theme", "light-theme"];
      trackEvents({
        event_type: "change_theme",
        event_data: "theme_toggle",
        previous_value,
        new_value
      });
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

export {
  trackLoad,
  trackEvents,
  Theme
};
