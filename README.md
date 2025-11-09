# Guide DevOps : Déploiement automatisé d'une application Nuxt

[![Nuxt UI](https://img.shields.io/badge/Made%20with-Nuxt%20UI-00DC82?logo=nuxt&labelColor=020420)](https://ui.nuxt.com)

Ce guide vous accompagne **étape par étape** pour créer une application Nuxt avec Nuxt UI et mettre en place un système de déploiement automatisé (DevOps).

---

## 🎯 Objectifs pédagogiques

À la fin de ce guide, vous saurez :

1. ✅ Créer un projet Nuxt avec Nuxt UI
2. ✅ Configurer un déploiement automatique sur GitHub Pages (environnement de test)
3. ✅ Mettre en place un workflow CI/CD avec GitHub Actions
4. ✅ Déployer en production via SFTP sur un hébergement web

---

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir :

### Outils de développement :
- ✅ **Node.js 20+** installé ([télécharger ici](https://nodejs.org/))
- ✅ **Git** installé et configuré
- ✅ Un **compte GitHub** actif
- ✅ Un **éditeur de code** (VS Code recommandé)

### Hébergement web (pour le déploiement en production) :
- ✅ Un **hébergement web** avec accès SFTP
- ✅ Les **identifiants de connexion** fournis par votre hébergeur :
  - Adresse du serveur (ex: `sftp.votredomaine.com`)
  - Nom d'utilisateur
  - Mot de passe
  - Port de connexion (généralement 22 pour SFTP)
  - Chemin du dossier web (ex: `/public_html/` ou `/www/`)

**⚠️ Important :** Ces identifiants vous seront fournis par votre hébergeur dans l'email d'activation de votre compte.

---

## 🚀 Étape 1 : Créer un nouveau projet Nuxt + Nuxt UI

### 1.1 Initialiser le projet

```bash
# Créer un nouveau projet Nuxt avec Nuxt UI
npx nuxi@latest init mon-projet-nuxt -t ui

# Aller dans le dossier du projet
cd mon-projet-nuxt

# Installer les dépendances
npm install
```

### 1.2 Tester en local

```bash
# Lancer le serveur de développement
npm run dev
```

Ouvrir http://localhost:3000 dans votre navigateur.

**✅ Checkpoint :** Vous devez voir l'interface Nuxt UI par défaut.

---

## ⚙️ Étape 2 : Configuration minimale pour le déploiement

### 2.1 Configurer le baseURL pour GitHub Pages

Modifier `nuxt.config.ts` :

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui'
  ],

  // Configuration pour GitHub Pages (sous-dossier)
  app: {
    baseURL: process.env.NUXT_APP_BASE_URL || '/',
    head: {
      link: [
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: `${process.env.NUXT_APP_BASE_URL || ''}/favicon.ico`.replace(/\/+/g, '/')
        }
      ]
    }
  },

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  compatibilityDate: '2025-01-15',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
```

**💡 Pourquoi cette configuration ?**
- `baseURL` : Permet de déployer dans un sous-dossier (ex: `/mon-projet/`)
- Variable d'environnement : Flexible pour différents environnements (local, test, production)
- Favicon avec baseURL : Fonctionne partout

### 2.2 Ajouter `.nojekyll` pour GitHub Pages

```bash
# Créer le dossier public s'il n'existe pas
mkdir -p public

# Créer le fichier .nojekyll (empêche Jekyll de traiter les fichiers)
touch public/.nojekyll
```

**✅ Checkpoint :** Votre configuration est prête pour le déploiement.

---

## 📦 Étape 3 : Créer le dépôt GitHub

### 3.1 Initialiser Git

```bash
# Initialiser le dépôt Git (si pas déjà fait)
git init

# Ajouter tous les fichiers
git add .

# Premier commit
git commit -m "feat: initial commit with Nuxt UI"
```

### 3.2 Créer le dépôt sur GitHub

1. Aller sur https://github.com/new
2. Nom du dépôt : `mon-projet-nuxt` (ou autre)
3. **Ne pas** initialiser avec README, .gitignore, ou licence
4. Cliquer sur "Create repository"

### 3.3 Pousser le code

```bash
# Lier le dépôt local au dépôt distant
git remote add origin https://github.com/<votre-username>/<nom-du-depot>.git

# Pousser le code
git branch -M main
git push -u origin main
```

**✅ Checkpoint :** Votre code est sur GitHub.

---

## 🔄 Étape 4 : Configurer GitHub Pages

### 4.1 Activer GitHub Pages

1. Aller dans votre dépôt sur GitHub
2. Cliquer sur **Settings** (Paramètres)
3. Dans le menu de gauche : **Pages**
4. Source : **GitHub Actions** (pas "Deploy from a branch")

**💡 Note :** GitHub Actions permet un déploiement automatisé via workflow.

---

## 🤖 Étape 5 : Créer le workflow de déploiement

### 5.1 Créer le fichier workflow

```bash
# Créer la structure des dossiers
mkdir -p .github/workflows

# Créer le fichier workflow
touch .github/workflows/deploy.yml
```

### 5.2 Configuration du workflow

Copier ce code dans `.github/workflows/deploy.yml` :

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Static HTML export with Nuxt
        run: npm run generate
        env:
          NUXT_APP_BASE_URL: /<nom-du-depot>/

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./.output/public

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

**⚠️ IMPORTANT :** Remplacer `<nom-du-depot>` par le nom de votre dépôt GitHub.

**Exemple :** Si votre dépôt s'appelle `mon-projet-nuxt` :
```yaml
NUXT_APP_BASE_URL: /mon-projet-nuxt/
```

### 5.3 Commit et push

```bash
# Ajouter le workflow
git add .github/workflows/deploy.yml public/.nojekyll

# Commit
git commit -m "ci: add GitHub Pages deployment workflow"

# Push
git push origin main
```

**✅ Checkpoint :** Le workflow se déclenche automatiquement !

---

## 🎉 Étape 6 : Vérifier le déploiement

### 6.1 Suivre le déploiement

1. Aller sur https://github.com/`<votre-username>`/`<nom-du-depot>`/actions
2. Cliquer sur le workflow en cours d'exécution
3. Attendre que toutes les étapes soient ✅ vertes

### 6.2 Accéder au site

URL de votre site : `https://<votre-username>.github.io/<nom-du-depot>/`

**Exemple :** `https://jean-dupont.github.io/mon-projet-nuxt/`

**✅ Félicitations !** Votre site de **test** est en ligne et se déploie automatiquement à chaque push sur `main`.

**📍 Vous êtes ici :** Environnement de test configuré
**➡️ Prochaine étape :** Configurer le déploiement en production (Étape 7)

---

## 🔧 Workflow de développement (test uniquement)

Maintenant que tout est configuré, voici le cycle de travail :

```
┌──────────────────────────────────────┐
│  1. Développer en local              │
│     npm run dev                      │
│                                      │
│  2. Tester les changements           │
│     http://localhost:3000            │
│                                      │
│  3. Commit + Push                    │
│     git add .                        │
│     git commit -m "feat: ..."        │
│     git push origin main             │
│                                      │
│  4. Déploiement automatique ! 🚀     │
│     GitHub Actions génère le site    │
│     GitHub Pages publie le site      │
└──────────────────────────────────────┘
```

---

## 🆘 Dépannage

### Le déploiement échoue

**Vérifier :**
1. ✅ `NUXT_APP_BASE_URL` correspond au nom de votre dépôt
2. ✅ GitHub Pages est activé (Settings → Pages → Source: GitHub Actions)
3. ✅ Le fichier `.nojekyll` existe dans `public/`

### Le site s'affiche sans styles

**Cause :** Le `baseURL` est incorrect.

**Solution :**
1. Vérifier `NUXT_APP_BASE_URL` dans `.github/workflows/deploy.yml`
2. Le format doit être : `/nom-du-depot/` (avec les `/` au début et à la fin)

### Erreurs 404 sur les assets

**Solution :** Vérifier que le fichier `.nojekyll` existe dans `public/`

---

## 📚 Ressources complémentaires

- [Documentation Nuxt](https://nuxt.com/docs)
- [Documentation Nuxt UI](https://ui.nuxt.com)
- [Guide GitHub Actions](https://docs.github.com/en/actions)
- [Guide GitHub Pages](https://docs.github.com/en/pages)

---

---

## 🚀 Étape 7 : Déploiement en production via SFTP

Cette étape finalise votre workflow DevOps en déployant automatiquement votre site sur un hébergement web professionnel.

### 7.1 Vérifier les prérequis

Assurez-vous d'avoir reçu de votre hébergeur :

- ✅ Un hébergement web avec accès SFTP
- ✅ L'email d'activation contenant vos identifiants de connexion

**📋 Informations nécessaires :**

| Information | Description | Où la trouver |
|-------------|-------------|---------------|
| **Serveur SFTP** | Adresse du serveur | Email d'activation de votre hébergeur |
| **Nom d'utilisateur** | Votre login SFTP | Email d'activation ou panneau de contrôle |
| **Mot de passe** | Votre mot de passe SFTP | Défini lors de l'activation |
| **Port** | Port de connexion | Généralement 22 (SFTP) |
| **Dossier web** | Chemin du dossier public | `/public_html/`, `/www/`, `/htdocs/` |

**💡 Exemple d'email d'activation :**
```
Serveur SFTP : sftp.monhebergeur.com
Utilisateur  : mon-site-123
Mot de passe : MotDePasse123!
Port         : 22
Dossier web  : /public_html/
```

### 7.2 Configurer les secrets GitHub

Les identifiants SFTP doivent être stockés de manière sécurisée dans GitHub.

**Étapes :**

1. Aller dans votre dépôt GitHub
2. Cliquer sur **Settings** (Paramètres)
3. Dans le menu de gauche : **Secrets and variables** → **Actions**
4. Cliquer sur **New repository secret**
5. Ajouter les secrets suivants :

| Nom du secret | Valeur | Exemple |
|---------------|--------|---------|
| `SFTP_SERVER` | Adresse du serveur | `sftp.monhebergeur.com` |
| `SFTP_USERNAME` | Nom d'utilisateur | `mon-site-123` |
| `SFTP_PASSWORD` | Mot de passe | `MotDePasse123!` |
| `SFTP_SERVER_DIR` | Dossier de destination | `/public_html/` |
| `SFTP_PORT` | Port de connexion | `22` |

**⚠️ Attention :** Ne JAMAIS mettre ces informations directement dans le code !

### 7.3 Créer le workflow de production

Créer le fichier `.github/workflows/deploy-production.yml` :

```yaml
name: Deploy to Production (SFTP)

on:
  # Déclenché uniquement lors de la création d'un tag
  push:
    tags:
      - 'v*.*.*'  # v1.0.0, v2.1.3, etc.

  # Permet le déclenchement manuel
  workflow_dispatch:

jobs:
  deploy-production:
    runs-on: ubuntu-latest

    environment:
      name: production
      url: https://votredomaine.com  # Remplacer par votre URL

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Generate static site for production
        run: npm run generate
        env:
          NODE_ENV: production

      - name: Deploy to Production via SFTP
        uses: wlixcc/SFTP-Deploy-Action@v1.2.4
        with:
          server: ${{ secrets.SFTP_SERVER }}
          username: ${{ secrets.SFTP_USERNAME }}
          password: ${{ secrets.SFTP_PASSWORD }}
          port: ${{ secrets.SFTP_PORT }}
          local_path: './.output/public/./'
          remote_path: ${{ secrets.SFTP_SERVER_DIR }}
          sftp_only: true
          delete_remote_files: false
```

### 7.4 Déployer en production

Pour déployer en production, créer un **tag Git** :

```bash
# Créer un tag de version
git tag v1.0.0

# Pousser le tag vers GitHub
git push origin v1.0.0
```

**✅ Résultat :** Le workflow se déclenche et déploie sur votre hébergement web !

### 7.5 Vérifier le déploiement

1. Aller sur https://github.com/`<votre-username>`/`<nom-du-depot>`/actions
2. Vérifier que le workflow "Deploy to Production (SFTP)" est ✅ vert
3. Accéder à votre site : `https://votredomaine.com`

---

## 🔄 Workflow complet (Test + Production)

Avec les deux workflows configurés, voici votre cycle DevOps complet :

```
┌────────────────────────────────────────────────────────┐
│  DÉVELOPPEMENT                                         │
│  ↓ npm run dev                                         │
│  ↓ Modifications du code                              │
│                                                        │
│  COMMIT + PUSH                                         │
│  ↓ git add . && git commit -m "feat: ..."            │
│  ↓ git push origin main                               │
│                                                        │
│  DÉPLOIEMENT AUTOMATIQUE TEST 🧪                      │
│  → GitHub Actions génère le site                      │
│  → GitHub Pages publie sur                            │
│     https://<username>.github.io/<repo>/              │
│                                                        │
│  TESTS ET VALIDATION ✅                                │
│  ↓ Vérifier que tout fonctionne                      │
│                                                        │
│  DÉPLOIEMENT PRODUCTION 🚀                             │
│  ↓ git tag v1.0.0                                     │
│  ↓ git push origin v1.0.0                             │
│  → GitHub Actions génère le site                      │
│  → SFTP déploie sur https://votredomaine.com          │
└────────────────────────────────────────────────────────┘
```

---

## 📋 Gestion des versions (Semantic Versioning)

**Format :** `vMAJEUR.MINEUR.PATCH`

```
v1.2.3
│ │ │
│ │ └─── PATCH  : Corrections de bugs (1.2.3 → 1.2.4)
│ └───── MINEUR : Nouvelles fonctionnalités (1.2.0 → 1.3.0)
└─────── MAJEUR : Changements incompatibles (1.0.0 → 2.0.0)
```

**Exemples :**
- `v0.1.0` → Première version de test
- `v1.0.0` → Première version stable en production
- `v1.1.0` → Ajout d'une nouvelle fonctionnalité
- `v1.1.1` → Correction d'un bug
- `v2.0.0` → Refonte majeure

---

## 🆘 Dépannage SFTP

### Erreur "Timeout (control socket)"

**Cause possible :** Le serveur utilise FTP au lieu de SFTP.

**Solution :**
1. Vérifier avec votre hébergeur s'il supporte SFTP (port 22)
2. Si votre hébergeur n'offre que FTP (port 21), contacter votre enseignant

### Erreur "Permission denied"

**Solution :**
1. Vérifier que `SFTP_SERVER_DIR` existe sur votre serveur
2. Vérifier que votre utilisateur a les droits d'écriture
3. Tester la connexion avec un client SFTP (FileZilla)

### Le site s'affiche sans styles en production

**Cause :** Le `baseURL` n'est pas configuré correctement.

**Solution :**
- Pour la production (racine du domaine), le `baseURL` doit être `/`
- Vérifier que `NUXT_APP_BASE_URL` n'est PAS défini dans le workflow production

---

## 📚 Ressources complémentaires

- [Documentation Nuxt](https://nuxt.com/docs)
- [Documentation Nuxt UI](https://ui.nuxt.com)
- [Guide GitHub Actions](https://docs.github.com/en/actions)
- [Guide GitHub Pages](https://docs.github.com/en/pages)
- [Semantic Versioning](https://semver.org/lang/fr/)

---

## ✅ Récapitulatif du guide complet

Vous avez maintenant mis en place :

1. ✅ **Projet Nuxt + Nuxt UI** fonctionnel
2. ✅ **Environnement de test** (GitHub Pages) avec déploiement automatique
3. ✅ **Environnement de production** (SFTP) avec déploiement par tags
4. ✅ **Workflow DevOps complet** : développement → test → production
5. ✅ **Bonnes pratiques** : CI/CD, Semantic Versioning, gestion des secrets

**🎓 Compétences acquises :**
- Configuration d'un projet Nuxt moderne
- Déploiement automatisé avec GitHub Actions
- Gestion de deux environnements (test/production)
- Utilisation de Git et des tags de version
- Sécurisation des credentials avec GitHub Secrets

---

**Made with ❤️ for apprentis développeurs**
