#!/usr/bin/env bash
# Réimporte le dump SQL en réinitialisant le volume MariaDB.
# À lancer depuis la racine du projet (ou depuis frontend avec npm run reset-db).

set -e
cd "$(dirname "$0")"

echo "Arrêt des conteneurs..."
docker-compose down

echo "Suppression des données MariaDB (volume mysql)..."
rm -rf mysql/*

echo "Redémarrage des conteneurs (le dump dans data/ sera chargé au premier démarrage)..."
docker-compose up -d

echo "En attente du démarrage de la BDD..."
sleep 5
docker-compose ps

echo "Terminé. La base jardin_actuel a été rechargée avec data/diay0794_ebb.sql"
