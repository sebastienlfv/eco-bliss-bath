# Réimporter le dump SQL (réinitialiser la BDD)

## Méthode 1 : Reset complet (recommandé)

Réinitialise le conteneur MariaDB pour que le dump dans `data/` soit rechargé au démarrage.

```bash
# À la racine du projet (Eco-Bliss-Bath-V2)
docker-compose down
rm -rf mysql/*
docker-compose up -d
```

Attendre que le conteneur `bliss-bath-bdd` soit healthy (les scripts dans `data/` sont exécutés au **premier** démarrage avec un volume vide). Ensuite la base `jardin_actuel` contient les données du fichier `data/diay0794_ebb.sql`.

---

## Méthode 2 : Importer le dump sans tout supprimer

Si les conteneurs tournent déjà et que vous voulez juste recharger le dump dans la base existante :

```bash
# 1. Supprimer la base et la recréer (pour éviter les conflits CREATE TABLE)
docker exec bliss-bath-bdd mysql -u root -pjardin -e "DROP DATABASE IF EXISTS jardin_actuel; CREATE DATABASE jardin_actuel;"

# 2. Importer le dump
docker exec -i bliss-bath-bdd mysql -u root -pjardin jardin_actuel < data/diay0794_ebb.sql
```

À exécuter **à la racine du projet** (où se trouve le dossier `data/`).

---

## Vérifier que les données sont là

```bash
docker exec bliss-bath-bdd mysql -u jardin -pjardin jardin_actuel -e "SELECT id, email, firstname, lastname FROM user;"
```

Vous devriez voir les utilisateurs dont `john.doe@test.fr` (mot de passe : `password`).
