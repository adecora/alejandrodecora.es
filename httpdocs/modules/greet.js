const RAINBOW = ["#ff0000", "#ffff00", "#00ff00", "#00ffff"]

const GREETING = [
  " ███████████                                   ███      █████                      ███          ",
  "░░███░░░░░███                                 ░░░      ░░███                     ███░           ",
  " ░███    ░███  ██████  ████████   █████ █████ ████   ███████   ██████          ███░     ██████  ",
  " ░██████████  ███░░███░░███░░███ ░░███ ░░███ ░░███  ███░░███  ███░░███       ███░      ░░░░░███ ",
  " ░███░░░░░███░███████  ░███ ░███  ░███  ░███  ░███ ░███ ░███ ░███ ░███     ███░         ███████ ",
  " ░███    ░███░███░░░   ░███ ░███  ░░███ ███   ░███ ░███ ░███ ░███ ░███   ███░          ███░░███ ",
  " ███████████ ░░██████  ████ █████  ░░█████    █████░░████████░░██████  ███░           ░░████████",
  "░░░░░░░░░░░   ░░░░░░  ░░░░ ░░░░░    ░░░░░    ░░░░░  ░░░░░░░░  ░░░░░░  ░░░              ░░░░░░░░ ",
]

GREETING.forEach((line, i) => {
  let color = RAINBOW[i % RAINBOW.length]

  console.log(`%c${line}`, `color: ${color}; font-family: monospace;`)
})

console.log(`
Supongo que si has llegado hasta aquí es por algún enlace en mi curriculum, gracias por quedarte y
seguir investigando.

Esta es una página sencilla a modo de presentación, está hecha con JavaScript vainilla utilizando
funcionalidades modernas como web components.

Se despliega con Netlify y tiene asociada un par de funciones que se se ejecutan durante la carga de
la página que me permiten trackear las visitas guardando un historial en google sheets y enviándome una
notificación a través de telegram.

El código fuente de este sitio https://github.com/adecora/alejandrodecora.es es libre bajo licencia AGPL 3.0.

PD: Ya que estas aquí puedes seguir inspeccionando el código en la pestña "elements" 🧐.`)
