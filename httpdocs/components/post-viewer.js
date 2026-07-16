import { marked } from "marked"
import { trackEvents } from "../modules/track.js"

class PostViewer extends HTMLElement {
  constructor() {
    super()
    this.currentPost = null
  }

  connectedCallback() {
    this.render()
    this.setupEventListeners()

    // Guardar referencias para poder eliminar los listeners
    this.handlePostSelected = (e) => {
      this.showPost(e.detail)
    }

    this.handlePopState = (e) => {
      if (e.state && e.state.post) {
        this.showPost(e.state.post, false)
      } else {
        this.hide()
      }
    }

    // Escuchar evento de post seleccionado
    document.addEventListener("post-selected", this.handlePostSelected)

    // Manejar navegación con historial del navegador
    window.addEventListener("popstate", this.handlePopState)

    // Verificar si hay un post en la URL al cargar
    this.checkUrlForPost()
  }

  async checkUrlForPost() {
    const urlParams = new URLSearchParams(window.location.search)
    const slug = urlParams.get("post")
    if (slug) {
      try {
        const response = await fetch("/posts.json")
        const posts = await response.json()
        const post = posts.find((p) => p.slug === slug)
        if (post) {
          this.showPost(post, false)
        }
      } catch (error) {
        console.error("Error loading post:", error)
      }
    }
  }

  render() {
    this.innerHTML = `
      <div class="post-viewer">
        <button class="post-close" aria-label="Cerrar post">×</button>
        <article class="post-content">
          <div class="markdown-content"></div>
        </article>
      </div>
    `
  }

  setupEventListeners() {
    const closeBtn = this.querySelector(".post-close")
    const viewer = this.querySelector(".post-viewer")

    // Listeners locales - no necesitan limpieza
    closeBtn.addEventListener("click", () => this.hide())

    // Cerrar al hacer click fuera del contenido
    viewer.addEventListener("click", (e) => {
      if (e.target === viewer) {
        this.hide()
      }
    })

    // Listener global - guardar referencia para limpieza
    this.handleKeydown = (e) => {
      if (e.key === "Escape" && viewer.classList.contains("active")) {
        this.hide()
      }
    }

    document.addEventListener("keydown", this.handleKeydown)
  }

  showPost(post, updateHistory = true) {
    this.currentPost = post
    const viewer = this.querySelector(".post-viewer")
    const content = this.querySelector(".markdown-content")

    // Configurar marked para usar clases de Prism
    marked.setOptions({
      highlight: function (code, lang) {
        if (lang && window.Prism && window.Prism.languages[lang]) {
          return window.Prism.highlight(
            code,
            window.Prism.languages[lang],
            lang,
          )
        }
        return code
      },
    })

    // Renderizar markdown
    const html = marked.parse(post.content)
    content.innerHTML = html

    // Corregir rutas de imágenes relativas para que apunten a /posts/
    const images = content.querySelectorAll('img[src^="./"]')
    images.forEach((img) => {
      const oldSrc = img.getAttribute("src")
      const newSrc = "/posts/" + oldSrc.substring(2) // Quita "./" y añade "/posts/"
      img.setAttribute("src", newSrc)
    })

    // Aplicar syntax highlighting con Prism
    if (window.Prism) {
      window.Prism.highlightAllUnder(content)
    }

    // Mostrar viewer
    viewer.classList.add("active")
    document.body.style.overflow = "hidden"

    // Actualizar URL
    if (updateHistory) {
      const newUrl = `${window.location.pathname}?post=${post.slug}`
      history.pushState({ post }, post.title, newUrl)
    }

    // Scroll al top
    viewer.scrollTop = 0
  }

  hide() {
    const viewer = this.querySelector(".post-viewer")
    viewer.classList.remove("active")
    document.body.style.overflow = ""

    // Enviar evento
    trackEvents({
      event_type: "post_view",
      event_data: this.currentPost.slug,
      new_value: "closed",
    })

    // Actualizar URL
    const newUrl = window.location.pathname
    history.pushState({}, "", newUrl)
    this.currentPost = null
  }

  disconnectedCallback() {
    // Limpiar solo los listeners globales
    document.removeEventListener("post-selected", this.handlePostSelected)
    window.removeEventListener("popstate", this.handlePopState)
    document.removeEventListener("keydown", this.handleKeydown)
  }
}

export { PostViewer }
