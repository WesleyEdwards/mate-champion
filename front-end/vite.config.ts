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


// For deploying to github, move the mate-champion/assets directory to
// just assets. This ensures that the path of the assets is correct.
// Also make sure that the path to the js is correct
// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const outDir = mode === "production" ? "build" : "../docs";
  const assetsDir = mode === "production" ? "assets" : "mate-champion/assets";
  const plugins =
    mode === "production"
      ? [react(), checker({ typescript: true })]
      : [react(), checker({ typescript: true }), relativePath()];

  return {
    plugins,
    build: { outDir, assetsDir },
    server: {
      port: 3000,
    },
  };
});
