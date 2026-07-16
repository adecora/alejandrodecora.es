/**
 * Descarga el CV actualizado alojando en Google Drive
 * hace un petición al endpoint "/cv"
 */
const DRIVE_FILE_ID = "1Z5HO-meMDL54SvcPSL02RMaHtbnfxZfW"
const DOWNLOAD_NAME = "Alejandro_de_Cora_CV.pdf"

export default async function handler() {
  const driveUrl = `https://drive.google.com/uc?export=download&id=${DRIVE_FILE_ID}`

  try {
    const driveResponse = await fetch(driveUrl, {
      redirect: "follow",
    })

    if (!driveResponse.ok || !driveResponse.body) {
      return new Response("No se ha podido descargar el CV.", {
        status: 502,
      })
    }

    return new Response(driveResponse.body, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${DOWNLOAD_NAME}"`,
        "Cache-Control": "no-store, max-age=0",
        "X-Content-Type-Options": "nosniff",
      },
    })
  } catch (error) {
    console.error("Error descargando el CV:", error)

    return new Response("No se ha podido descargar el CV.", {
      status: 500,
    })
  }
}

export const config = { path: "/cv", method: "GET" }
