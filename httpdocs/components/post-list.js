import { trackEvents } from "../modules/track.js"

class PostList extends HTMLElement {
  constructor() {
    super()
    this.posts = []
  }

  async connectedCallback() {
    await this.loadPosts()
    this.render()
  }

  async loadPosts() {
    try {
      const response = await fetch("/posts.json")
      this.posts = await response.json()
    } catch (error) {
      console.error("Error loading posts:", error)
      this.posts = []
    }
  }

  formatDate(dateString) {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  render() {
    const postsHTML = this.posts
      .map(
        (post) => `
        <article class="post-card" data-slug="${post.slug}">
          <div class="post-date">${this.formatDate(post.date)}</div>
          <h2 class="post-title">${post.title}</h2>
          <p class="post-intro">${post.intro}</p>
        </article>
      `,
      )
      .join("")

    this.innerHTML = `
      <div class="posts-grid">
        ${postsHTML}
      </div>
    `

    // Añadir event listeners a las tarjetas
    this.querySelectorAll(".post-card").forEach((card) => {
      card.addEventListener("click", () => {
        const slug = card.dataset.slug
        const post = this.posts.find((p) => p.slug === slug)
        if (post) {
          this.dispatchEvent(
            new CustomEvent("post-selected", {
              detail: post,
              bubbles: true,
            }),
          )

          trackEvents({
            event_type: "post_view",
            event_data: post.slug,
            new_value: "opened",
          })
        }
      })
    })
  }
}

export { PostList }
