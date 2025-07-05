/**
 * Guarda la información recibida en esta función en una hoja de cálculo
 * de google.
 */
import { google } from "googleapis"

const credentials = {
  type: process.env.GOOGLE_TYPE,
  project_id: process.env.GOOGLE_PROJECT_ID,
  private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
  private_key: atob(process.env.GOOGLE_PRIVATE_KEY),
  client_email: process.env.GOOGLE_CLIENT_EMAIL,
  client_id: process.env.GOOGLE_CLIENT_ID,
  auth_uri: process.env.GOOGLE_AUTH_URI,
  token_uri: process.env.GOOGLE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.GOOGLE_CLIENT_X509_CERT_URL,
  universe_domain: process.env.GOOGLE_UNIVERSE_DOMAIN,
}
const { SPREADSHEET_ID, SHEET_NAME } = process.env

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
})

const sheets = google.sheets({ version: "v4", auth })

export const handler = async (event) => {
  const logData = JSON.parse(event.body)

  const request = {
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_NAME}!A:I`, // Rango donde insertar (ajusta según columnas)
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    resource: {
      values: [logData], // logData es un array, ej: [timestamp, ip, image, userAgent]
    },
  }

  return sheets.spreadsheets.values
    .append(request)
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
    statusCode: 422,
    body: JSON.stringify(error),
  }
}
