#!/usr/bin/env node
/**
 * Réinitialise la base de données en réimportant le dump SQL.
 * Compatible Windows, Mac et Linux.
 * Nécessite que les conteneurs Docker soient démarrés (docker-compose up -d).
 */

const { execSync, spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const PROJECT_ROOT = path.resolve(__dirname);
const DUMP_PATH = path.join(PROJECT_ROOT, "data", "diay0794_ebb.sql");
const CONTAINER = "bliss-bath-bdd";

function resetDatabase() {
  console.log("Réinitialisation de la base de données...");

  if (!fs.existsSync(DUMP_PATH)) {
    console.error(`Erreur: le fichier ${DUMP_PATH} n'existe pas.`);
    process.exit(1);
  }

  // Vérifier que le conteneur tourne
  try {
    const output = execSync(`docker ps -q -f name=${CONTAINER}`, {
      encoding: "utf8",
    }).trim();
    if (!output) {
      throw new Error("Conteneur non trouvé");
    }
  } catch {
    console.error(
      `Erreur: le conteneur ${CONTAINER} ne tourne pas. Lancez 'docker-compose up -d' d'abord.`
    );
    process.exit(1);
  }

  // 1. Supprimer et recréer la base (spawnSync évite les problèmes d'échappement sur Windows)
  console.log("Suppression et recréation de la base jardin_actuel...");
  const dropResult = spawnSync(
    "docker",
    [
      "exec",
      CONTAINER,
      "mariadb",
      "-u",
      "root",
      "-pjardin",
      "-e",
      "DROP DATABASE IF EXISTS jardin_actuel; CREATE DATABASE jardin_actuel;",
    ],
    { stdio: "inherit" }
  );
  if (dropResult.status !== 0) {
    console.error("Erreur lors de la suppression/recréation de la base.");
    process.exit(1);
  }

  // 2. Importer le dump
  console.log("Import du dump SQL...");
  const sql = fs.readFileSync(DUMP_PATH, "utf8");
  const result = spawnSync(
    "docker",
    ["exec", "-i", CONTAINER, "mariadb", "-u", "root", "-pjardin", "jardin_actuel"],
    {
      input: sql,
      stdio: ["pipe", "inherit", "inherit"],
      encoding: "utf8",
    }
  );

  if (result.status !== 0) {
    console.error("Erreur lors de l'import du dump.");
    process.exit(1);
  }

  console.log("Base de données réinitialisée avec succès.");
}

resetDatabase();
