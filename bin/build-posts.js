#!/usr/bin/env node

import { readdir, readFile, writeFile } from "fs/promises"
import { join } from "path"

const POSTS_DIR = "httpdocs/posts"
const OUTPUT_FILE = "httpdocs/posts.json"

// Parsear frontmatter de archivos markdown
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/
  const match = content.match(frontmatterRegex)

  if (!match) {
    return { metadata: {}, content: content }
  }

  const [, frontmatterStr, markdownContent] = match
  const metadata = {}

  frontmatterStr.split("\n").forEach((line) => {
    const [key, ...valueParts] = line.split(":")
    if (key && valueParts.length > 0) {
      const value = valueParts
        .join(":")
        .trim()
        .replace(/^["']|["']$/g, "")
      metadata[key.trim()] = value
    }
  })

  return { metadata, content: markdownContent.trim() }
}

async function buildPosts() {
  try {
    const files = await readdir(POSTS_DIR)
    const markdownFiles = files.filter((file) => file.endsWith(".md"))

    const posts = await Promise.all(
      markdownFiles.map(async (file) => {
        const filePath = join(POSTS_DIR, file)
        const content = await readFile(filePath, "utf-8")
        const { metadata, content: markdownContent } = parseFrontmatter(content)

        // Si no hay slug en metadata, usar el nombre del archivo
        if (!metadata.slug) {
          metadata.slug = file.replace(".md", "")
        }

        return {
          ...metadata,
          content: markdownContent,
          filename: file,
        }
      }),
    )

    // Ordenar posts por fecha (más recientes primero)
    posts.sort((a, b) => new Date(b.date) - new Date(a.date))

    await writeFile(OUTPUT_FILE, JSON.stringify(posts, null, 2))
    console.log(`✅ Generated ${OUTPUT_FILE} with ${posts.length} posts`)
  } catch (error) {
    console.error("Error building posts:", error)
    process.exit(1)
  }
}

buildPosts()
