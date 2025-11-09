# Guide DevOps : Déploiement automatisé d'une application Nuxt

[![Nuxt UI](https://img.shields.io/badge/Made%20with-Nuxt%20UI-00DC82?logo=nuxt&labelColor=020420)](https://ui.nuxt.com)

Ce guide vous accompagne **étape par étape** pour créer une application Nuxt avec Nuxt UI et mettre en place un système de déploiement automatisé (DevOps).

---

## 🎯 Objectifs pédagogiques

À la fin de ce guide, vous saurez :

1. ✅ Créer un projet Nuxt avec Nuxt UI
2. ✅ Configurer un déploiement automatique sur GitHub Pages (environnement de test)
3. ✅ Mettre en place un workflow CI/CD avec GitHub Actions
4. ✅ (Optionnel) Déployer en production via SFTP

---

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir :

- ✅ **Node.js 20+** installé ([télécharger ici](https://nodejs.org/))
- ✅ **Git** installé et configuré
- ✅ Un **compte GitHub** actif
- ✅ Un **éditeur de code** (VS Code recommandé)

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

**✅ Félicitations !** Votre site est en ligne et se déploie automatiquement à chaque push sur `main`.

---

## 🔧 Workflow de développement

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

## 🎓 Aller plus loin

### Option 1 : Déploiement en production via SFTP

Pour déployer sur un serveur de production (hébergement web), consulter le guide avancé sur le déploiement SFTP.

### Option 2 : Ajout de tests automatisés

Intégrer des tests dans le workflow CI/CD pour valider le code avant le déploiement.

### Option 3 : Environnements multiples

Créer plusieurs environnements (dev, staging, production) avec des workflows différents.

---

**Made with ❤️ for apprentis développeurs**
