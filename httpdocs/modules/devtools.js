// Comprueba si se ha abierto la consola. Ver https://github.com/sindresorhus/devtools-detect/blob/main/index.js
let open = false
const threshold = 170

const checkDevtools = () => {
  const widthThreshold = window.outerWidth - window.innerWidth > threshold
  const heightThreshold = window.outerHeight - window.innerHeight > threshold
  const orientation = widthThreshold ? "vertical" : "horizontal"

  if (widthThreshold || heightThreshold) {
    if (!open) {
      open = true
      window.dispatchEvent(
        new CustomEvent("devtoolsOpened", {
          detail: { orientation },
        }),
      )
    }
  } else {
    open = false
  }
}

setInterval(checkDevtools, 500)
