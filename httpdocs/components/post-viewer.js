import { marked } from "marked"

class PostViewer extends HTMLElement {
  constructor() {
    super()
    this.currentPost = null
  }

  connectedCallback() {
    this.render()
    this.setupEventListeners()

    // Escuchar evento de post seleccionado
    document.addEventListener("post-selected", (e) => {
      this.showPost(e.detail)
    })

    // Manejar navegación con historial del navegador
    window.addEventListener("popstate", (e) => {
      if (e.state && e.state.post) {
        this.showPost(e.state.post, false)
      } else {
        this.hide()
      }
    })

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

    closeBtn.addEventListener("click", () => this.hide())

    // Cerrar con Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && viewer.classList.contains("active")) {
        this.hide()
      }
    })

    // Cerrar al hacer click fuera del contenido
    viewer.addEventListener("click", (e) => {
      if (e.target === viewer) {
        this.hide()
      }
    })
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

    // Actualizar URL
    const newUrl = window.location.pathname
    history.pushState({}, "", newUrl)
    this.currentPost = null
  }
}

export { PostViewer }
