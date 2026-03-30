<div align="center">

# Eco-Bliss-Bath

</div>

<p align="center">
    <img src="https://img.shields.io/badge/MariaDB-v11.7.2-blue" alt="MariaDB">
    <img src="https://img.shields.io/badge/Symfony-v6.2-blue" alt="Symfony">
    <img src="https://img.shields.io/badge/Angular-v13.3.0-blue" alt="Angular">
    <img src="https://img.shields.io/badge/docker--build-passing-brightgreen" alt="Docker">
</p>

Application e-commerce (Angular + API Symfony en conteneur + MariaDB).

---

## Prérequis

- **Docker** et **Docker Compose** (ou `docker compose` intégré)
- **Node.js** (recommandé : LTS) et **npm**
- **Git** (pour cloner le dépôt)

---

## Installation

### 1. Récupérer le projet

```bash
git clone https://github.com/OpenClassrooms-Student-Center/Eco-Bliss-Bath-V2.git
cd Eco-Bliss-Bath-V2
```

*(Adaptez le chemin si votre dossier a un autre nom, par ex. `eco-bliss-bath`.)*

### 2. API et base de données (Docker)

À la **racine du projet** (là où se trouve `docker-compose.yml`) :

```bash
docker compose up -d
```

*(Sur certaines installations, la commande est `docker-compose up -d`.)*

- Attendre que le conteneur **`bliss-bath-bdd`** soit **healthy**, puis que **`bliss-bath-symfony`** soit prêt.
- L’API est exposée sur **http://localhost:8081** (ex. santé : `http://localhost:8081/api/health`).

**Premier démarrage :** si le dossier `mysql/` est vide, MariaDB exécute les scripts du dossier `data/` (dont le dump `data/diay0794_ebb.sql`).

### 3. Frontend (Angular)

```bash
cd frontend
npm install
```

---

## Lancer l’application

1. **Docker** (si ce n’est pas déjà fait) :

   ```bash
   docker compose up -d
   ```

2. **Frontend** :

   ```bash
   cd frontend
   npm start
   ```

   Le serveur de dev écoute en général sur **http://localhost:4200/** (rechargement automatique à la sauvegarde).

3. Ouvrir le navigateur sur **http://localhost:4200/**.

**Compte de test (données du dump) :** `john.doe@test.fr` / `password`.

---

## Lancer les tests

Les tests E2E (Cypress) parlent à l’API sur le port **8081** : lancez **Docker avant** les tests.

Un script à la racine du projet réinitialise la base avant les tests Cypress (tâche `resetDb` + `beforeEach`) : le conteneur **`bliss-bath-bdd`** doit tourner.

### Tests unitaires (Karma / Jasmine)

```bash
cd frontend
npm test
```

*(Lance `ng test` — navigateur requis selon la config Karma.)*

### Tests E2E (Cypress)

```bash
cd frontend
npm run test:e2e
```

Mode interactif (Cypress UI) :

```bash
cd frontend
npm run test:e2e:open
```

Lancer un fichier de spec précis :

```bash
cd frontend
npx cypress run --spec "cypress/e2e/smoke/cart-checkout-xss.cy.js"
```

### Réinitialiser la base sans tout recréer (recommandé au quotidien)

Avec les conteneurs **déjà démarrés**, à la racine du projet :

```bash
node reset-db.js
```

Ou depuis `frontend` :

```bash
npm run reset-db
```

---

## Réinitialiser complètement la base (volume `mysql`)

Utile si MariaDB ne démarre plus correctement (données corrompues, mot de passe root incohérent) ou pour forcer le rechargement du dump au **premier** démarrage sur volume vide.

**Linux / macOS :**

```bash
docker compose down
rm -rf mysql/*
docker compose up -d
```

**Windows (PowerShell), à la racine du projet :**

```powershell
docker compose down
Remove-Item -Recurse -Force .\mysql\*
docker compose up -d
```

Attendre que **`bliss-bath-bdd`** soit **healthy**. La base `jardin_actuel` est alors peuplée comme défini dans `data/`.

### Import du dump sans vider tout le volume (avancé)

Si MariaDB tourne déjà et que vous importez à la main, avec l’image **MariaDB 11** le client en ligne de commande est **`mariadb`** (plus `mysql`) :

```bash
docker exec bliss-bath-bdd mariadb -u root -pjardin -e "DROP DATABASE IF EXISTS jardin_actuel; CREATE DATABASE jardin_actuel;"
docker exec -i bliss-bath-bdd mariadb -u root -pjardin jardin_actuel < data/diay0794_ebb.sql
```

*(Sous Windows, préférez `node reset-db.js` qui gère l’import de façon portable.)*

### Vérifier les utilisateurs en base

```bash
docker exec bliss-bath-bdd mariadb -u jardin -pjardin jardin_actuel -e "SELECT id, email, firstname, lastname FROM user;"
```

---

## Build de production (frontend)

```bash
cd frontend
npm run build
```

Les fichiers générés sont dans `frontend/dist/`.

---

## Dépannage rapide

| Problème | Piste |
|----------|--------|
| Conteneur BDD **unhealthy** | Vider `mysql/` puis `docker compose up -d` (voir section ci-dessus). |
| API inaccessible | `docker compose ps` — vérifier que `bliss-bath-symfony` et `bliss-bath-bdd` sont up. |
| Tests Cypress qui échouent sur la BDD | Démarrer Docker, puis `node reset-db.js`. |

---

## Structure utile

| Élément | Rôle |
|---------|------|
| `docker-compose.yml` | MariaDB + image API Symfony |
| `frontend/` | Application Angular |
| `data/` | Scripts SQL d’init (dump) |
| `mysql/` | Données persistantes MariaDB (volume local) |
| `reset-db.js` | Réimport du dump dans `jardin_actuel` (Node, multi-plateforme) |
