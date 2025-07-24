let trackingOn = null

class FancyDate extends Date {
  constructor(...args) {
    super(...args)
  }

  toTinybird() {
    return this.toISOString().slice(0, 19).replace("T", " ")
  }

  toTelegram() {
    return this.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }
}

async function trackData() {
  const queryParams = new URLSearchParams(location.search)
  const name = queryParams.get("👀")

  const requestIP = await fetch("/.netlify/functions/ip")
  const { ip } = await requestIP.json()

  const requestGEO = await fetch("/geo")
  const { city, country } = await requestGEO.json()

  const theme = localStorage.getItem("theme")

  const timestamp = new FancyDate()
  const data = {
    name: name ?? "unknown",
    language: navigator.language ?? "unknown",
    useragent: navigator.userAgent ?? "unknown",
    theme: theme ?? "light-mode",
    ip: ip ?? "unknown",
    city: city ?? "unknown",
    code: country.code ?? "unknown",
    country: country.name ?? "unknown",
  }

  const msgUint8 = new TextEncoder().encode(JSON.stringify(data))
  const hashBuffer = await window.crypto.subtle.digest("SHA-1", msgUint8)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")

  return [
    timestamp,
    {
      session_id: hashHex,
      ...data,
    },
  ]
}

async function getTracking() {
  if (!trackingOn) {
    trackingOn = trackData()
  }
  return trackingOn
}

async function trackLoad() {
  const [timestamp, data] = await getTracking()
  fetch("/.netlify/functions/log", {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
    body: JSON.stringify({ timestamp: timestamp.toTinybird(), ...data }),
  }).catch((error) => {
    console.error(`No se ha podido registrar la vista: ${error}`)
  })

  data.timestamp = timestamp.toTelegram()

  fetch("/.netlify/functions/notify", {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
    body: JSON.stringify(
      { timestamp: timestamp.toTelegram(), ...data },
      ["timestamp", "useragent", "name", "usergent", "city"],
      "\t",
    ),
  }).catch((error) => {
    console.error(`No se ha podido notificar la vista: ${error}`)
  })
}

async function trackEvents({
  event_type,
  event_data = "unknown",
  previous_value = "unknown",
  new_value = "unknown",
}) {
  const [timestamp, { session_id }] = await getTracking()

  fetch("/.netlify/functions/event", {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
    body: JSON.stringify({
      timestamp: timestamp.toTinybird(),
      session_id,
      event_type,
      event_data,
      previous_value,
      new_value,
    }),
  }).catch((error) => {
    console.error(`No se ha podido registrar la vista: ${error}`)
  })
}

export { trackEvents, trackLoad }
