/**
 * Devuelve la ciudad y la información del país del visitante que
 * hace un petición al endpoint "/geo"
 */
export default async function handler(request, context) {
  const { city, country } = context.geo
  return new Response(
    JSON.stringify({
      city,
      country,
    })
  )
}

export const config = { path: "/geo" }
