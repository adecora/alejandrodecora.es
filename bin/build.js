#!/usr/bin/env node

import { build } from "esbuild"

const buildOptions = {
  entryPoints: ["httpdocs/app.js", "httpdocs/app.css"],
  minify: false,
  bundle: true,
  splitting: true,
  format: "esm",
  external: ["/fonts/*"],
  outdir: "httpdocs/build",
}

build(buildOptions).catch(() => process.exit(1))
