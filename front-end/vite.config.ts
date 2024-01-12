import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import checker from "vite-plugin-checker";

function relativePath() {
  return {
    name: "relativePathChange",
    transformIndexHtml(html: string) {
      return html
        .replace("/favicon.ico", "./favicon.ico")
        .replace("/assets/", "./assets/");
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const outDir = mode === "production" ? "build" : "../docs";
  const plugins =
    mode === "production"
      ? [react(), checker({ typescript: true })]
      : [react(), checker({ typescript: true }), relativePath()];

  return {
    plugins,
    build: { outDir },
    server: {
      port: 3000,
    },
  };
});
