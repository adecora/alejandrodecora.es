const RAINBOW = ["#ff0000", "#ffff00", "#00ff00", "#00ffff"]

const GREETING = {
  gl: [
    " ███████████                                   ███      █████                      ███          ",
    "░░███░░░░░███                                 ░░░      ░░███                     ███░           ",
    " ░███    ░███  ██████  ████████   █████ █████ ████   ███████   ██████          ███░     ██████  ",
    " ░██████████  ███░░███░░███░░███ ░░███ ░░███ ░░███  ███░░███  ███░░███       ███░      ░░░░░███ ",
    " ░███░░░░░███░███████  ░███ ░███  ░███  ░███  ░███ ░███ ░███ ░███ ░███     ███░         ███████ ",
    " ░███    ░███░███░░░   ░███ ░███  ░░███ ███   ░███ ░███ ░███ ░███ ░███   ███░          ███░░███ ",
    " ███████████ ░░██████  ████ █████  ░░█████    █████░░████████░░██████  ███░           ░░████████",
    "░░░░░░░░░░░   ░░░░░░  ░░░░ ░░░░░    ░░░░░    ░░░░░  ░░░░░░░░  ░░░░░░  ░░░              ░░░░░░░░ ",
  ],
  es: [
    " ███████████   ███                                                       ███      █████                      ███          ",
    "░░███░░░░░███ ░░░                                                       ░░░      ░░███                     ███░           ",
    " ░███    ░███ ████   ██████  ████████   █████ █████  ██████  ████████   ████   ███████   ██████          ███░     ██████  ",
    " ░██████████ ░░███  ███░░███░░███░░███ ░░███ ░░███  ███░░███░░███░░███ ░░███  ███░░███  ███░░███       ███░      ░░░░░███ ",
    " ░███░░░░░███ ░███ ░███████  ░███ ░███  ░███  ░███ ░███████  ░███ ░███  ░███ ░███ ░███ ░███ ░███     ███░         ███████ ",
    " ░███    ░███ ░███ ░███░░░   ░███ ░███  ░░███ ███  ░███░░░   ░███ ░███  ░███ ░███ ░███ ░███ ░███   ███░          ███░░███ ",
    " ███████████  █████░░██████  ████ █████  ░░█████   ░░██████  ████ █████ █████░░████████░░██████  ███░           ░░████████",
    "░░░░░░░░░░░  ░░░░░  ░░░░░░  ░░░░ ░░░░░    ░░░░░     ░░░░░░  ░░░░ ░░░░░ ░░░░░  ░░░░░░░░  ░░░░░░  ░░░              ░░░░░░░░ ",
  ],
  en: [
    " █████   ███   █████          ████                                            ",
    "░░███   ░███  ░░███          ░░███                                            ",
    " ░███   ░███   ░███   ██████  ░███   ██████   ██████  █████████████    ██████ ",
    " ░███   ░███   ░███  ███░░███ ░███  ███░░███ ███░░███░░███░░███░░███  ███░░███",
    " ░░███  █████  ███  ░███████  ░███ ░███ ░░░ ░███ ░███ ░███ ░███ ░███ ░███████ ",
    "  ░░░█████░█████░   ░███░░░   ░███ ░███  ███░███ ░███ ░███ ░███ ░███ ░███░░░  ",
    "    ░░███ ░░███     ░░██████  █████░░██████ ░░██████  █████░███ █████░░██████ ",
    "     ░░░   ░░░       ░░░░░░  ░░░░░  ░░░░░░   ░░░░░░  ░░░░░ ░░░ ░░░░░  ░░░░░░  ",
  ],
}

const WELCOME = {
  gl: `
Supoño que se has chegado hasta aquí e por algún enlace no meu currículum, gracias por quedarte e
seguir a investigar.

Esta e unha sencilla páxina a modo de presentación, feita con JavaScript vainilla utilizando
funcionalidades modernas como os web components.

Despliegase con Netlify e ten asociadas un par de funcións que se executan durante a carga da páxina, que
me permiten traquear as visitas, gardar un historial en Google Sheets e recibir unha notificación a
través do Telegram.

O código fonte de este sitio  https://github.com/adecora/alejandrodecora.es é libre baixo licencia AGPL 3.0.

PD: Xa que estas aquí, podes seguir inspeccionando o código na pestana "Elements" 🧐.`,
  es: `
Supongo que si has llegado hasta aquí es por algún enlace en mi currículum, gracias por quedarte y
seguir investigando.

Esta es una página sencilla a modo de presentación, hecha con JavaScript vainilla utilizando
funcionalidades modernas como los web components.

Se despliega con Netlify y tiene asociadas un par de funciones que se se ejecutan durante la carga de
la página, que me permiten traquear las visitas, guardar un historial en Google Sheets y recibir una
notificación a través de Telegram.

El código fuente de este sitio https://github.com/adecora/alejandrodecora.es es libre bajo licencia AGPL 3.0.

PD: Ya que estas aquí, puedes seguir inspeccionando el código en la pestaña "Elements" 🧐.`,
  en: `
I guess if you've made it here, it’s because you found a link on my curriculum. Thanks for sticking around and
taking a look.

This is a simple landing page made with vanilla JavaScript, using modern features like web components.

It’s deployed on Netlify and has a couple of functions that run during page load, allowing me to track visits,
save a history to Google Sheets, and send myself a notification via Telegram.

The source code for this site https://github.com/adecora/alejandrodecora.es is open under the AGPL 3.0 license.

PS: Since you’re here, feel free to keep inspecting the code in the “Elements” tab 🧐.`,
}

window.easter_egg = {
  gl: `
Graciñas por leer o meu currículum e chegar hasta aquí. Podes
<a href="mailto:alejandrodecora@gmail.com?subject=Bom currículum&body=¡Contratado! Comezas a primeiros do vindeiro mes.">contactarme 📬</a>
, esperoche 😚. <img src="images/esperando.webp" alt="Esperando tranquilamente no parque" width="100" height="200" />`,
  es: `
Gracias por leer mi currículum y llegar hasta aquí. Puedes
<a href="mailto:alejandrodecora@gmail.com?subject=Muy buen currículum&body=¡Contratado! Empiezas a principios del próximo mes.">contactarme 📬</a>
, te espero 😚.<img src="images/esperando.webp" alt="Esperando tranquilamente en el parque" width="100" height="200" />`,
  en: `
Thanks for reading my curriculum and making it this far. You can
<a href="mailto:alejandrodecora@gmail.com?subject=Awesome curriculum&body=You're hired! You start at the beginning of next month.">reach out 📬</a>
, I’ll be waiting 😚. <img src="images/esperando.webp" alt="Chilling at the park while waiting" width="100" height="200" />`,
}

document.addEventListener("DOMContentLoaded", () => {
  const lang = document.documentElement.lang

  GREETING[lang].forEach((line, i) => {
    let color = RAINBOW[i % RAINBOW.length]

    console.log(`%c${line}`, `color: ${color}; font-family: monospace;`)
  })

  console.log(WELCOME[lang])
})
