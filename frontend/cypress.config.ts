import { defineConfig } from "cypress";
import { spawnSync } from "child_process";
import path from "path";

export default defineConfig({
  experimentalInteractiveRunEvents: true, // Nécessaire pour que before:run s'exécute en mode cypress open
  e2e: {
    setupNodeEvents(on, config) {
      // Tâche pour réinitialiser la BDD (appelable avant chaque it())
      on("task", {
        resetDb() {
          const projectRoot = path.resolve(__dirname, "..");
          const resetScript = path.join(projectRoot, "reset-db.js");
          const result = spawnSync("node", [resetScript], {
            encoding: "utf8",
            cwd: projectRoot,
          });
          if (result.status !== 0) {
            throw new Error(result.stderr || `Reset BDD échoué (code ${result.status})`);
          }
          return null;
        },
      });
    },
  },
});
