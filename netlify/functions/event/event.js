/**
 * Guarda la información recibida en esta función en un datasource en
 * Tinybird.
 */

const { TINYBIRD_EVENTS, TINYBIRD_TOKEN } = process.env

export const handler = async (event) => {
  const URL = `https://api.tinybird.co/v0/events?name=${TINYBIRD_EVENTS}`

  const request = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TINYBIRD_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: event.body,
  }

  return fetch(URL, request)
    .then((response) => response.json())
    .then(onSuccess)
    .catch(onError)
}

function onSuccess(res) {
  return {
    statusCode: 200,
    body: JSON.stringify(res),
  }
}

function onError(error) {
  return {
    statusCode: 418, // Looks like I'm a 🫖
    body: JSON.stringify(error),
  }
}
