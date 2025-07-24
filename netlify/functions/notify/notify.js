/**
 * Envía una notificación a un bot de le telegram con la información recibida
 * en esta función.
 */
const { TELEGRAM_TOKEN, TELEGRAM_ID } = process.env

export const handler = (event) => {
  const URL = `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`

  const request = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: process.env.TELEGRAM_ID,
      text: `
\`\`\`json
${event.body}
\`\`\`
`,
      parse_mode: "MarkdownV2",
    }),
  }

  return fetch(URL, request)
    .then((response) => response.json())
    .then(onSuccess)
    .catch(onError)
}

function onSuccess(res) {
  let statusCode

  if (!res.ok) statusCode = res.error_code

  return {
    statusCode: statusCode ?? 200,
    body: JSON.stringify(res),
  }
}

function onError(error) {
  return {
    statusCode: 418, // Looks like I'm a 🫖
    body: JSON.stringify(error),
  }
}
