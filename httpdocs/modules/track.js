export default async function () {
  const queryParams = new URLSearchParams(location.search)
  const name = queryParams.get("👀")

  const requestIP = await fetch("/.netlify/functions/ip")
  const { ip } = await requestIP.json()

  const requestGEO = await fetch("/geo")
  const { city, country } = await requestGEO.json()

  const theme = localStorage.getItem("theme")

  const data = {
    timestamp: new Date().toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    name: name ?? "unknown",
    language: navigator.language ?? "unknown",
    useragent: navigator.userAgent ?? "unknown",
    theme: theme ?? "light-mode",
    ip: ip ?? "unknown",
    city: city ?? "unknown",
    code: country.code ?? "unknown",
    country: country.name ?? "unknown",
  }

  fetch("/.netlify/functions/log", {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
    body: JSON.stringify(Object.values(data)),
  }).catch((error) => {
    console.error(`No se ha podido registrar la vista: ${error}`)
  })

  fetch("/.netlify/functions/notify", {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
    body: JSON.stringify(
      data,
      ["timestamp", "useragent", "name", "usergent", "city"],
      "\t",
    ),
  }).catch((error) => {
    console.error(`No se ha podido notificar la vista: ${error}`)
  })
}
