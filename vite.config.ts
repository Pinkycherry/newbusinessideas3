// The build, written out in full. Until 2026-09-28 these plugins and settings
// came from a wrapper package; they are now listed here directly, with the same
// options, so nothing about the output changed.
import { execSync } from "node:child_process";

import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig, loadEnv, type PluginOption } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

// Deploy stamp for /version.json (src/routes/version[.]json.ts). Workers Builds
// injects WORKERS_CI_COMMIT_SHA; a local build falls back to git. Never throws.
function buildCommit(): string {
  const fromCi = process.env["WORKERS_CI_COMMIT_SHA"];
  if (fromCi) return fromCi;
  try {
    return execSync("git rev-parse HEAD", { stdio: ["ignore", "pipe", "ignore"] })
      .toString()
      .trim();
  } catch {
    return "unknown";
  }
}

export default defineConfig(({ command, mode }) => {
  const plugins: PluginOption[] = [
    tailwindcss(),
    tsConfigPaths({ projects: ["./tsconfig.json"] }),
    tanstackStart({
      importProtection: {
        behavior: "error",
        client: { files: ["**/server/**"], specifiers: ["server-only"] },
      },
      // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
      server: { entry: "server" },
    }),
  ];
  // Cloudflare Workers output, build only.
  if (command === "build") plugins.push(nitro({ defaultPreset: "cloudflare-module" }));
  plugins.push(viteReact());

  // VITE_* variables, visible to both the browser and the server bundles.
  const envDefine: Record<string, string> = {};
  for (const [key, value] of Object.entries(loadEnv(mode, process.cwd(), "VITE_"))) {
    envDefine[`import.meta.env.${key}`] = JSON.stringify(value);
  }

  return {
    define: {
      ...envDefine,
      __BBI_COMMIT__: JSON.stringify(buildCommit()),
      __BBI_BUILT_AT__: JSON.stringify(new Date().toISOString()),
    },
    css: { transformer: "lightningcss" },
    resolve: {
      alias: { "@": `${process.cwd()}/src` },
      dedupe: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "@tanstack/react-query",
        "@tanstack/query-core",
      ],
    },
    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "react-dom/client",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
      ],
      ignoreOutdatedRequests: true,
    },
    server: {
      host: "::",
      port: 8080,
      watch: { awaitWriteFinish: { stabilityThreshold: 1000, pollInterval: 100 } },
    },
    plugins,
  };
});
