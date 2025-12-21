import { SveltePlugin } from "bun-plugin-svelte";
import { rm, mkdir } from "node:fs/promises";
import { join } from "node:path";

const outdir = join(import.meta.dir, "dist");

// Clean output directory
await rm(outdir, { recursive: true, force: true });
await mkdir(join(outdir, "styles"), { recursive: true });

// Build Svelte app
const result = await Bun.build({
  entrypoints: [join(import.meta.dir, "app.ts")],
  outdir,
  plugins: [SveltePlugin()],
  target: "browser",
  minify: false,
  sourcemap: "linked",
});

if (!result.success) {
  console.error("Build failed:");
  for (const log of result.logs) {
    console.error(log);
  }
  process.exit(1);
}

// Build Tailwind CSS using Tailwind CLI
console.log("Building Tailwind CSS...");
const tailwindProc = Bun.spawn([
  "bunx",
  "tailwindcss",
  "-i", join(import.meta.dir, "styles/main.css"),
  "-o", join(outdir, "styles/main.css"),
], {
  cwd: join(import.meta.dir, ".."),
  stdout: "inherit",
  stderr: "inherit",
});

const tailwindResult = await tailwindProc.exited;
if (tailwindResult !== 0) {
  console.error("Tailwind build failed");
  process.exit(1);
}

// Copy index.html with updated script path
const html = await Bun.file(join(import.meta.dir, "index.html")).text();
const updatedHtml = html.replace(
  'src="./app.ts"',
  'src="./app.js"'
);
await Bun.write(join(outdir, "index.html"), updatedHtml);

console.log("✅ Build complete! Output in web/dist/");
for (const output of result.outputs) {
  console.log(`  - ${output.path}`);
}
console.log(`  - ${join(outdir, "styles/main.css")}`);
