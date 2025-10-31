import { $ } from "bun";
import { promises as fs } from "node:fs";
import path from "node:path";

const outDir = ".vercel/output";
const funcDir = path.join(outDir, "functions", "index.func");
const staticDir = path.join(outDir, "static");
const entryJs = path.join(funcDir, "index.js");

async function main() {
  console.log("🔨 Building for Vercel...");
  
  // Clean output directory
  await fs.rm(outDir, { recursive: true, force: true });
  await fs.mkdir(funcDir, { recursive: true });
  await fs.mkdir(staticDir, { recursive: true });

  // Bundle a single ESM file for Node runtime (not --target bun)
  console.log("📦 Bundling with Bun for Node.js runtime...");
  
  // 먼저 임시 파일로 번들링
  const tempBundle = path.join(funcDir, "app.js");
  await $`bun build src/index.ts \
    --target=node \
    --format=esm \
    --minify-syntax --minify-whitespace \
    --outfile ${tempBundle}`;

  // Vercel 서버리스 함수 래퍼 추가
  const wrapperCode = `
import app from './app.js';

export default async function handler(request) {
  return app.fetch(request);
}
`;
  
  await fs.writeFile(entryJs, wrapperCode);

  // Make Node treat index.js as ESM inside the function mount
  await fs.writeFile(
    path.join(funcDir, "package.json"),
    JSON.stringify({ type: "module" }, null, 2)
  );

  // Function runtime config
  await fs.writeFile(
    path.join(funcDir, ".vc-config.json"),
    JSON.stringify(
      {
        runtime: "nodejs22.x",
        handler: "index.js",
        launcherType: "Nodejs",
        shouldAddHelpers: true,
      },
      null,
      2
    )
  );

  // Routes: static first, then all to the function with CORS headers
  await fs.writeFile(
    path.join(outDir, "config.json"),
    JSON.stringify(
      {
        version: 3,
        routes: [
          { 
            handle: "filesystem" 
          },
          {
            src: "/(.*)",
            dest: "/index",
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
              "Access-Control-Allow-Headers": "Content-Type, Authorization",
              "Access-Control-Max-Age": "86400"
            }
          }
        ]
      },
      null,
      2
    )
  );

  console.log("✅ Build Output API ready at .vercel/output");
}

main().catch((err) => {
  console.error("❌ Build failed:", err);
  process.exit(1);
});

