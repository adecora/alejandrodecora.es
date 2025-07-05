/**
 * Devuelve la dirección IP de los visitantes que
 * hacen una petición a esta función.
 */
export const handler = async (event) => {
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers":
        "Origin, X-Requested-With, Content-Type, Accept",
    },
    body: JSON.stringify({
      ip:
        event.headers["x-nf-client-connection-ip"] !== "::1"
          ? event.headers["x-nf-client-connection-ip"]
          : "127.0.0.1",
    }),
  }
}
