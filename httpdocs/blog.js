import { Theme } from "./components/theme.js"
import { PostList } from "./components/post-list.js"
import { PostViewer } from "./components/post-viewer.js"

// Registrar componentes
customElements.define("x-theme", Theme)
customElements.define("post-list", PostList)
customElements.define("post-viewer", PostViewer)
