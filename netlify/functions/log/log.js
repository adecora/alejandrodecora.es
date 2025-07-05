/**
 * Guarda la información recibida en esta función en una hoja de cálculo
 * de google.
 */
import { google } from "googleapis"

const credentials = JSON.parse(process.env.GOOGLE_CREDS)
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
  console.lof(error)
  return {
    statusCode: 422,
    body: JSON.stringify(error),
  }
}
