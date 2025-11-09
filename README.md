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

## 💡 C'est quoi le DevOps ? (Introduction pour débutants)

Si vous débutez, vous vous demandez peut-être : **"C'est quoi le DevOps ?"**

### Définition simple

**DevOps** = **Dev**elopment (Développement) + **Op**erations (Exploitation)

C'est une **approche de travail** qui consiste à automatiser au maximum le processus de mise en ligne d'une application.

### Le problème sans DevOps

**Méthode traditionnelle (manuelle) :**

```
┌─────────────────────────────────────────────────────────┐
│  1. Vous codez sur votre ordinateur                     │
│  2. Vous testez manuellement                            │
│  3. Vous compilez manuellement                          │
│  4. Vous uploadez les fichiers via FTP                  │
│  5. Vous vérifiez que tout fonctionne                   │
│  6. Si problème → Recommencer depuis l'étape 1          │
└─────────────────────────────────────────────────────────┘
```

**Problèmes :**
- ❌ Chronophage (10-30 minutes par déploiement)
- ❌ Risques d'oublis (oublier un fichier, une étape)
- ❌ Erreurs humaines (mauvais dossier, mauvaise version)
- ❌ Pas reproductible (différent à chaque fois)
- ❌ Difficile à plusieurs développeurs

### La solution DevOps (automatisée)

**Méthode DevOps (ce que vous allez apprendre) :**

```
┌─────────────────────────────────────────────────────────┐
│  1. Vous codez sur votre ordinateur                     │
│  2. Vous faites "git push"                              │
│  3. ✨ MAGIE : Tout le reste se fait automatiquement ✨ │
│     ├─ Tests automatiques                               │
│     ├─ Compilation automatique                          │
│     ├─ Déploiement automatique                          │
│     └─ Vérifications automatiques                       │
│  4. Votre site est en ligne ! 🎉                        │
└─────────────────────────────────────────────────────────┘
```

**Avantages :**
- ✅ Rapide (30 secondes à 2 minutes)
- ✅ Fiable (toujours les mêmes étapes)
- ✅ Sécurisé (moins d'erreurs humaines)
- ✅ Reproductible (fonctionne à l'identique)
- ✅ Collaboration facilitée (toute l'équipe utilise le même processus)

### Analogie : La chaîne de montage automobile

**Sans DevOps (artisanat) :**
Chaque voiture est assemblée à la main, différemment, avec des risques d'oubli de pièces.

**Avec DevOps (usine moderne) :**
Chaîne automatisée : chaque voiture passe par les mêmes étapes, dans le même ordre, sans erreur.

### Les 3 piliers du DevOps que vous allez apprendre

1. **CI (Continuous Integration)** = Intégration Continue
   - Tester automatiquement chaque modification
   - Compiler automatiquement le projet

2. **CD (Continuous Deployment)** = Déploiement Continu
   - Déployer automatiquement après les tests
   - Mettre en ligne sans intervention humaine

3. **Infrastructure as Code**
   - Définir l'infrastructure dans des fichiers (workflows YAML)
   - Versionner la configuration avec Git

### Concrètement, dans ce guide

Vous allez apprendre à :
- **Pousser votre code** sur GitHub (`git push`)
- **Automatiser la compilation** avec GitHub Actions
- **Déployer automatiquement** sur 2 environnements :
  - **Test** (GitHub Pages) : pour vérifier avant mise en production
  - **Production** (SFTP) : le site accessible au public

**Résultat :** À la fin de ce guide, vous aurez un **workflow DevOps professionnel** fonctionnel ! 🚀

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

**💡 Comprendre la commande :**

```
npx nuxi@latest init mon-projet-nuxt -t ui
│   │     │      │      │                │
│   │     │      │      │                └─ Template (modèle) avec Nuxt UI pré-installé
│   │     │      │      └─────────────────── Nom de votre projet (à personnaliser)
│   │     │      └────────────────────────── Initialiser (= créer) un nouveau projet
│   │     └───────────────────────────────── Toujours utiliser la dernière version
│   └─────────────────────────────────────── Outil officiel pour créer un projet Nuxt
└─────────────────────────────────────────── Exécute un outil sans l'installer (comme "essayer avant d'acheter")
```

**Différence npx vs npm :**
- **`npm install`** : Installe des packages dans votre projet
- **`npx`** : Exécute un outil temporairement sans installation permanente

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
// Fichier de configuration principal de Nuxt
// https://nuxt.com/docs/api/nuxt-config

export default defineNuxtConfig({
  // ========================================
  // MODULES NUXT
  // ========================================
  // Modules = extensions qui ajoutent des fonctionnalités à Nuxt
  modules: [
    '@nuxt/eslint',  // Vérification de la qualité du code (linting)
    '@nuxt/ui'       // Bibliothèque de composants UI pré-stylés
  ],

  // ========================================
  // CONFIGURATION DE L'APPLICATION
  // ========================================
  app: {
    // baseURL : Chemin de base de l'application
    // Important pour GitHub Pages qui héberge dans un sous-dossier
    // Exemple :
    //   - En local : '/' (racine)
    //   - GitHub Pages : '/mon-projet-nuxt/' (sous-dossier)
    //   - Production : '/' (racine du domaine)
    baseURL: process.env.NUXT_APP_BASE_URL || '/',

    // Configuration du <head> HTML (balises meta, favicon, etc.)
    head: {
      link: [
        {
          rel: 'icon',                // Type de lien : icône
          type: 'image/x-icon',       // Format du fichier
          // Chemin du favicon avec gestion du baseURL
          // Le .replace(/\/+/g, '/') évite les doubles slashes (//)
          href: `${process.env.NUXT_APP_BASE_URL || ''}/favicon.ico`.replace(/\/+/g, '/')
        }
      ]
    }
  },

  // ========================================
  // OUTILS DE DÉVELOPPEMENT
  // ========================================
  devtools: {
    enabled: true  // Active les DevTools Nuxt pour le débogage
  },

  // ========================================
  // STYLES CSS GLOBAUX
  // ========================================
  // Fichiers CSS appliqués à toutes les pages
  css: ['~/assets/css/main.css'],

  // ========================================
  // COMPATIBILITÉ
  // ========================================
  // Date de référence pour les comportements de Nuxt
  // Garantit la compatibilité avec les versions futures
  compatibilityDate: '2025-01-15',

  // ========================================
  // CONFIGURATION ESLINT
  // ========================================
  // Règles de style de code pour la cohérence du projet
  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',   // Pas de virgule finale (ex: [1, 2, 3] ✅ pas [1, 2, 3,] ❌)
        braceStyle: '1tbs'      // Style d'accolades "One True Brace Style"
      }
    }
  }
})
```

**💡 Pourquoi cette configuration ?**
- `baseURL` : Permet de déployer dans un sous-dossier (ex: `/mon-projet/`)
- Variable d'environnement : Flexible pour différents environnements (local, test, production)
- Favicon avec baseURL : Fonctionne partout

#### 🔑 Comprendre les variables d'environnement

**Qu'est-ce que `process.env` ?**

**Analogie** : Comme les paramètres de votre smartphone (luminosité, volume) qui changent selon le contexte (dehors vs intérieur).

```typescript
baseURL: process.env.NUXT_APP_BASE_URL || '/',
         └──────────┬──────────┘            └─┬─┘
              Lire le paramètre          Valeur par défaut
```

**Explication :**
- **`process.env`** = Accès aux paramètres de configuration de l'application
- **`NUXT_APP_BASE_URL`** = Nom du paramètre personnalisé (créé par vous)
- **`||`** = "OU" en JavaScript : Si pas défini, utiliser la valeur après
- **`'/'`** = Valeur par défaut (racine du site)

**Exemple concret selon l'environnement :**

| Environnement | NUXT_APP_BASE_URL défini ? | baseURL utilisé |
|---------------|---------------------------|-----------------|
| **Développement local** | ❌ Non | `'/'` (par défaut) |
| **GitHub Pages** | ✅ Oui = `/mon-projet/` | `/mon-projet/` |
| **Production SFTP** | ❌ Non | `'/'` (par défaut) |

**Où définir ces variables ?**
- En développement : Pas besoin, utilise la valeur par défaut
- Dans les workflows : Section `env:` (vous le verrez à l'Étape 5)
- Localement (tests) : Créer un fichier `.env` (optionnel)

#### 📐 Comprendre baseURL avec exemples visuels

**Le baseURL définit le "chemin de base" de votre application**

**Cas 1 : baseURL = '/' (racine du domaine)**
```
https://votredomaine.com/              ← Page d'accueil
https://votredomaine.com/about         ← Page "à propos"
https://votredomaine.com/images/logo.png
```

**Cas 2 : baseURL = '/mon-projet/' (sous-dossier)**
```
https://votredomaine.com/mon-projet/              ← Page d'accueil
https://votredomaine.com/mon-projet/about         ← Page "à propos"
https://votredomaine.com/mon-projet/images/logo.png
```

**⚠️ Les `/` au début ET à la fin sont OBLIGATOIRES :**
```
✅ '/mon-projet/'  → Fonctionne correctement
❌ 'mon-projet/'   → Liens cassés (/ manquant au début)
❌ '/mon-projet'   → Liens cassés (/ manquant à la fin)
❌ 'mon-projet'    → Liens cassés (tout manque)
```

**Règle à retenir** : Toujours entourer de `/` au début ET à la fin pour un sous-dossier.

### 2.2 Ajouter `.nojekyll` pour GitHub Pages

```bash
# Créer le dossier public s'il n'existe pas
mkdir -p public

# Créer le fichier .nojekyll (empêche Jekyll de traiter les fichiers)
touch public/.nojekyll
```

#### 🚫 Pourquoi créer `.nojekyll` ?

**⚠️ IMPORTANT : Ce fichier est UNIQUEMENT nécessaire pour GitHub Pages !**

Si vous déployez UNIQUEMENT sur un serveur SFTP (production), ce fichier n'est **pas nécessaire**.
Cependant, dans ce guide, nous utilisons **deux environnements** :
- 🧪 **Test** : GitHub Pages (nécessite `.nojekyll`)
- 🚀 **Production** : SFTP (n'a pas besoin de `.nojekyll`)

---

**Le problème spécifique à GitHub Pages :**

GitHub Pages utilise automatiquement **Jekyll**, un générateur de sites statiques. Jekyll a une règle stricte : il **ignore** tous les dossiers et fichiers commençant par `_` (underscore).

**Notre problème avec Nuxt :**

Quand Nuxt génère votre site, il crée un dossier `_nuxt/` contenant tout votre JavaScript et CSS :

```
.output/public/
  ├── _nuxt/           ← Jekyll IGNORE ce dossier !
  │   ├── app.js       ← JavaScript de votre site
  │   └── app.css      ← Styles de votre site
  ├── index.html
  └── ...
```

**Résultat sans `.nojekyll` sur GitHub Pages :**
- ❌ Jekyll ignore `_nuxt/`
- ❌ Vos fichiers JS/CSS ne sont pas publiés
- ❌ Votre site s'affiche tout blanc sans styles ni interactivité

**La solution : `.nojekyll`**

En créant un fichier vide nommé `.nojekyll`, vous dites à GitHub Pages :
> "N'utilise PAS Jekyll, publie TOUS mes fichiers tels quels"

**Résultat avec `.nojekyll` sur GitHub Pages :**
- ✅ Tous les fichiers sont publiés, y compris `_nuxt/`
- ✅ Votre site fonctionne parfaitement

**Analogie :**
Panneau "Ne pas déranger" sur une porte de chambre d'hôtel = Jekyll ne touche à rien.

---

#### 📊 Tableau comparatif : Où `.nojekyll` est-il nécessaire ?

| Environnement | Jekyll actif ? | `.nojekyll` nécessaire ? | Raison |
|---------------|----------------|--------------------------|--------|
| **GitHub Pages** | ✅ Oui | ✅ **OBLIGATOIRE** | Sinon Jekyll ignore `_nuxt/` → site cassé |
| **SFTP (production)** | ❌ Non | ❌ Inutile | Le serveur héberge les fichiers tels quels |
| **Développement local** | ❌ Non | ❌ Inutile | `npm run dev` ne passe pas par Jekyll |

---

#### 💡 Puis-je supprimer `.nojekyll` de mon projet ?

**Oui, SI :**
- ✅ Vous déployez UNIQUEMENT sur SFTP (pas GitHub Pages)
- ✅ Vous n'utilisez jamais l'environnement de test GitHub Pages

**Non, SI :**
- ❌ Vous utilisez GitHub Pages (même juste pour tester)
- ❌ Vous suivez ce guide complet (avec 2 environnements)

---

#### 🎓 Exercice d'apprentissage (optionnel)

Pour comprendre l'impact de `.nojekyll`, essayez ceci :

1. **Supprimer temporairement** `public/.nojekyll`
2. **Push** vers GitHub
3. **Attendre** que le workflow GitHub Pages se termine
4. **Visiter** votre site de test sur `https://username.github.io/projet/`
5. **Constater** que le site est tout blanc (CSS/JS manquants)
6. **Inspecter** (F12) → Console → Erreurs 404 sur `_nuxt/...`
7. **Remettre** `public/.nojekyll` et re-push
8. **Constater** que tout fonctionne à nouveau ✅

**Ce que cet exercice enseigne :**
- Comprendre l'impact réel de `.nojekyll`
- Apprendre à déboguer avec la console du navigateur
- Voir concrètement la différence entre "avec" et "sans"

---

**✅ Checkpoint :** Vous comprenez maintenant pourquoi et quand `.nojekyll` est nécessaire !

---

## 📦 Étape 3 : Créer le dépôt GitHub

### 📖 Git pour débutants : Comprendre les bases

Si vous débutez avec Git, voici les concepts essentiels expliqués simplement.

#### 🌐 Git local vs Git distant (GitHub)

**Analogie** : Votre projet Git = Deux versions de votre carnet de notes

```
┌─────────────────────────────────────────────────────────────┐
│  VERSION LOCALE (votre ordinateur)                          │
│  📓 Carnet chez vous                                        │
│                                                             │
│  - Vous écrivez dedans tous les jours                      │
│  - Visible uniquement par vous                             │
│  - Sauvegardé sur votre disque dur                         │
│  - Commandes : git init, git add, git commit               │
└─────────────────────────────────────────────────────────────┘
                            ↕ git push / git pull
┌─────────────────────────────────────────────────────────────┐
│  VERSION DISTANTE (GitHub)                                  │
│  ☁️ Carnet dans le cloud                                   │
│                                                             │
│  - Copie en ligne, accessible partout                      │
│  - Visible par vos collègues/enseignants                   │
│  - Sauvegarde de secours                                   │
│  - Commandes : git push, git pull, git clone               │
└─────────────────────────────────────────────────────────────┘
```

#### 📝 Les 3 étapes pour sauvegarder votre travail

**Analogie** : Envoyer un colis par La Poste

**Étape 1 : Préparer l'envoi** (`git init`)
```bash
git init
```
= "Installer une boîte aux lettres chez vous"
- Transforme votre dossier en projet Git
- Crée un dossier caché `.git/` qui stocke l'historique
- À faire **une seule fois** par projet

**Étape 2 : Emballer** (`git add`)
```bash
git add .
```
= "Mettre vos fichiers dans le carton"
- Le `.` signifie "tous les fichiers modifiés"
- Prépare les fichiers pour la sauvegarde
- On peut aussi faire `git add fichier.txt` pour un fichier précis

**Étape 3 : Étiqueter et poster** (`git commit`)
```bash
git commit -m "feat: initial commit with Nuxt UI"
```
= "Coller une étiquette et poster le colis"
- `-m` = "message" (étiquette du colis)
- Le message explique ce que contient le colis
- **"feat:"** = Convention pour dire "nouvelle fonctionnalité" (voir ci-dessous)

**Résultat** : Votre projet est sauvegardé localement avec un historique

#### 🔗 Connecter local et distant (`git remote`)

```bash
git remote add origin https://github.com/username/projet.git
```

**Décomposition** :
- **`git remote add`** = "Créer un lien vers un dépôt distant"
- **`origin`** = Nom conventionnel du dépôt principal (comme "principal" ou "défaut")
- **`https://github.com/...`** = Adresse du dépôt distant sur GitHub

**Analogie** : Enregistrer l'adresse postale dans votre carnet d'adresses

#### 📤 Envoyer votre code sur GitHub (`git push`)

```bash
git push -u origin main
```

**Décomposition** :
- **`git push`** = "Pousser" (envoyer) les commits vers GitHub
- **`-u`** = "Set upstream" = Mémoriser la destination pour les prochaines fois
- **`origin`** = Nom du dépôt distant (défini plus haut)
- **`main`** = Nom de la branche à envoyer

**Analogie** : Déposer le colis à La Poste pour envoi

#### 📋 Convention Conventional Commits

**Format** : `type: description`

Les types courants pour vos projets :

| Type | Signification | Exemple | Quand l'utiliser |
|------|---------------|---------|------------------|
| `feat:` | Nouvelle fonctionnalité | `feat: add contact form` | Ajout d'une nouvelle page, composant, etc. |
| `fix:` | Correction de bug | `fix: resolve navbar issue` | Réparer quelque chose qui ne marche pas |
| `docs:` | Documentation uniquement | `docs: update README` | Modifier README, commentaires, etc. |
| `style:` | Style/mise en forme | `style: format code` | Indentation, espaces, pas de changement logique |
| `refactor:` | Refactoring | `refactor: simplify function` | Réécrire du code sans changer le comportement |
| `test:` | Ajout de tests | `test: add login tests` | Ajouter des tests unitaires |
| `chore:` | Tâches diverses | `chore: update dependencies` | Mise à jour de packages, config, etc. |
| `ci:` | CI/CD | `ci: add deployment workflow` | Modifier les workflows GitHub Actions |

**Pourquoi cette convention ?**
- ✅ Historique Git plus clair et professionnel
- ✅ Génération automatique de changelogs
- ✅ Collaboration facilitée en équipe
- ✅ Recherche de commits plus facile

**C'est obligatoire ?**
Non, mais **fortement recommandé** dans le monde professionnel. Dans ce guide, nous l'utilisons pour vous habituer aux bonnes pratiques.

**Exemples concrets :**
```bash
git commit -m "feat: add dark mode toggle"
git commit -m "fix: correct responsive menu on mobile"
git commit -m "docs: add installation instructions"
git commit -m "style: format CSS files"
```

---

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

### 🤖 Comprendre : GitHub Actions vs Deploy from a branch

**Deux façons de publier votre site sur GitHub Pages :**

#### Option 1 : Deploy from a branch ❌ (Ancienne méthode)

```
┌─────────────────────────────────────────────────┐
│  VOUS : Push code → GitHub                     │
└──────────────┬──────────────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────────────┐
│  GITHUB PAGES : Publie directement la branche  │
│  ⚠️ Problème : Publie le CODE SOURCE           │
│  (fichiers .vue, .ts, non compilés)            │
│  → Le navigateur ne peut pas les lire !        │
└─────────────────────────────────────────────────┘
```

**Pourquoi ça ne marche pas pour Nuxt :**
- Nuxt a besoin d'être **compilé** (transformé en HTML/CSS/JS)
- GitHub Pages publierait votre code source non compilé
- Résultat : Site cassé ❌

---

#### Option 2 : GitHub Actions ✅ (Méthode moderne - celle que nous utilisons)

```
┌──────────────────────────────────────────────────────────┐
│  VOUS : Push code → GitHub                               │
└────────────┬─────────────────────────────────────────────┘
             │
             ↓
┌──────────────────────────────────────────────────────────┐
│  GITHUB ACTIONS : Workflow automatique                   │
│  1. ✅ Télécharge votre code                             │
│  2. ✅ Installe Node.js et les dépendances               │
│  3. ✅ COMPILE le projet (npm run generate)              │
│  4. ✅ Publie les fichiers COMPILÉS sur GitHub Pages     │
└────────────┬─────────────────────────────────────────────┘
             │
             ↓
┌──────────────────────────────────────────────────────────┐
│  GITHUB PAGES : Héberge le site compilé                 │
│  ✅ Fichiers HTML/CSS/JS prêts à l'emploi                │
│  → Le navigateur peut les afficher !                    │
└──────────────────────────────────────────────────────────┘
```

**Avantages de GitHub Actions :**
- ✅ **Automatise** la compilation (plus d'oublis !)
- ✅ **Optimise** le code (minification, compression)
- ✅ **Teste** avant de déployer (si vous configurez des tests)
- ✅ **Flexible** : vous contrôlez chaque étape
- ✅ **Évolutif** : facile d'ajouter des étapes (linting, tests, etc.)

**Analogie :**
- **Option 1** = Photocopier vos notes manuscrites et les distribuer
- **Option 2** = Imprimante automatique qui met en page, relie et distribue

**C'est pour ça qu'on choisit "GitHub Actions" ! 🚀**

---

## 🤖 Étape 5 : Créer le workflow de déploiement

### 📚 Comprendre le workflow CI/CD (pour débutants)

Avant de créer le workflow, prenons le temps de comprendre ce qu'est un **workflow CI/CD** et comment il fonctionne.

#### Qu'est-ce qu'un workflow ?

**Workflow** = Ensemble d'instructions automatisées qui s'exécutent en réponse à un événement.

**Analogie** : Recette de cuisine automatisée
- **Événement déclencheur** : Vous appuyez sur "Start" (= vous faites `git push`)
- **Ingrédients** : Votre code source
- **Étapes** : Les instructions de la recette (installer, compiler, déployer)
- **Résultat** : Un plat prêt (= site web en ligne)

#### CI/CD en détail

**CI = Continuous Integration (Intégration Continue)**

```
┌──────────────────────────────────────────────────────┐
│  VOUS : git push                                     │
└────────────┬─────────────────────────────────────────┘
             │
             ↓
┌──────────────────────────────────────────────────────┐
│  CI : Vérifier et intégrer votre code               │
│  ├─ Récupérer le code                               │
│  ├─ Installer les dépendances                       │
│  ├─ Exécuter les tests (si configurés)              │
│  ├─ Vérifier le style de code (linting)             │
│  └─ Compiler/Générer le site                        │
└────────────┬─────────────────────────────────────────┘
             │
             ↓ Si tout est ✅ vert
```

**Objectif CI :** S'assurer que votre code fonctionne avant de le déployer

**CD = Continuous Deployment (Déploiement Continu)**

```
             ↓ Code validé par CI
┌──────────────────────────────────────────────────────┐
│  CD : Déployer automatiquement                      │
│  ├─ Prendre les fichiers compilés                   │
│  ├─ Les envoyer sur le serveur                      │
│  └─ Rendre le site accessible                       │
└────────────┬─────────────────────────────────────────┘
             │
             ↓
┌──────────────────────────────────────────────────────┐
│  RÉSULTAT : Site en ligne ! 🎉                      │
└──────────────────────────────────────────────────────┘
```

**Objectif CD :** Déployer automatiquement le code validé

#### Exemple concret : Votre workflow GitHub Actions

Voici ce qui va se passer **automatiquement** à chaque `git push` :

**1. Événement déclencheur** (`on: push`)
```
Vous faites : git push origin main
→ GitHub détecte un nouveau commit
→ GitHub Actions démarre le workflow
```

**2. Job CI : Build** (Compilation)
```yaml
Job "build" démarre sur une machine virtuelle Ubuntu
  ├─ Étape 1 : Checkout (télécharger votre code)
  ├─ Étape 2 : Setup Node.js (installer Node.js 20)
  ├─ Étape 3 : npm ci (installer les dépendances)
  ├─ Étape 4 : npm run generate (compiler le site)
  └─ Étape 5 : Upload artifact (sauvegarder les fichiers compilés)
```

**3. Job CD : Deploy** (Déploiement)
```yaml
Job "deploy" démarre (après succès du job "build")
  ├─ Télécharger l'artifact (fichiers compilés)
  └─ Déployer sur GitHub Pages
```

**4. Résultat**
```
✅ Votre site est en ligne à : https://username.github.io/projet/
⏱️ Temps total : 1-2 minutes
```

#### Schéma visuel complet du workflow

```
┌─────────────────────────────────────────────────────────────┐
│  DÉVELOPPEUR (vous)                                         │
│  ├─ Modifier le code                                        │
│  ├─ git add .                                               │
│  ├─ git commit -m "feat: add feature"                       │
│  └─ git push origin main                                    │
└────────────┬────────────────────────────────────────────────┘
             │
             ↓ ÉVÉNEMENT DÉCLENCHEUR
┌─────────────────────────────────────────────────────────────┐
│  GITHUB détecte le push                                     │
│  → Lance GitHub Actions                                     │
└────────────┬────────────────────────────────────────────────┘
             │
             ↓ WORKFLOW CI/CD DÉMARRE
┌─────────────────────────────────────────────────────────────┐
│  MACHINE VIRTUELLE 1 : Job "build" (CI)                    │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ Step 1 : Checkout code          ✅ (5 sec)           │ │
│  │ Step 2 : Setup Node.js           ✅ (10 sec)          │ │
│  │ Step 3 : npm ci                  ✅ (20 sec)          │ │
│  │ Step 4 : npm run generate        ✅ (30 sec)          │ │
│  │ Step 5 : Upload artifact         ✅ (5 sec)           │ │
│  └───────────────────────────────────────────────────────┘ │
│  → Création d'un ARTIFACT (fichiers compilés)              │
└────────────┬────────────────────────────────────────────────┘
             │
             ↓ Build réussi ✅
┌─────────────────────────────────────────────────────────────┐
│  MACHINE VIRTUELLE 2 : Job "deploy" (CD)                   │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ Step 1 : Download artifact       ✅ (3 sec)           │ │
│  │ Step 2 : Deploy to GitHub Pages  ✅ (10 sec)          │ │
│  └───────────────────────────────────────────────────────┘ │
└────────────┬────────────────────────────────────────────────┘
             │
             ↓ Deploy réussi ✅
┌─────────────────────────────────────────────────────────────┐
│  RÉSULTAT FINAL                                             │
│  ✅ Site en ligne : https://username.github.io/projet/      │
│  ⏱️ Temps total : ~90 secondes                              │
│  📧 Notification : Email de succès (optionnel)              │
└─────────────────────────────────────────────────────────────┘
```

#### Concepts clés à retenir

**1. Jobs (Tâches)**
- **Job = Groupe d'étapes** qui s'exécutent sur une machine virtuelle
- Notre workflow a **2 jobs** : `build` et `deploy`
- Les jobs peuvent s'exécuter en **parallèle** ou **séquentiellement**
- Ici : `deploy` attend que `build` réussisse (mot-clé `needs: build`)

**2. Steps (Étapes)**
- **Step = Action individuelle** dans un job
- Exemples : télécharger le code, installer Node.js, compiler
- Les steps s'exécutent **dans l'ordre**, sur la **même machine**

**3. Artifacts (Artefacts)**
- **Artifact = Archive temporaire** de fichiers
- Permet de **transférer des fichiers entre jobs**
- Dans notre cas : fichiers compilés du job `build` vers le job `deploy`

**4. Triggers (Déclencheurs)**
- **on: push** = À chaque push sur une branche
- **on: pull_request** = À chaque pull request
- **workflow_dispatch** = Déclenchement manuel
- **schedule** = Déclenchement planifié (cron)

#### Avantages de ce workflow CI/CD

| Aspect | Sans CI/CD | Avec CI/CD |
|--------|------------|------------|
| **Vitesse** | 10-30 min (manuel) | 1-2 min (auto) |
| **Erreurs** | Fréquentes | Rares |
| **Reproductibilité** | Variable | Identique à chaque fois |
| **Tests** | Souvent oubliés | Automatiques |
| **Rollback** | Difficile | Facile (historique Git) |
| **Collaboration** | Complexe | Fluide |

#### Questions fréquentes des débutants

**Q : Où s'exécute le workflow ?**
R : Sur des **machines virtuelles** fournies gratuitement par GitHub (2000 min/mois pour les comptes gratuits)

**Q : Dois-je payer pour GitHub Actions ?**
R : Non, c'est **gratuit** pour les dépôts publics et vous avez 2000 minutes/mois pour les dépôts privés.

**Q : Que se passe-t-il si le workflow échoue ?**
R : Le déploiement est **annulé**, votre ancien site reste en ligne, et vous recevez une notification.

**Q : Puis-je voir les logs ?**
R : Oui ! Onglet **Actions** sur GitHub → Cliquer sur le workflow → Voir chaque étape en détail.

**Q : Comment annuler un déploiement en cours ?**
R : Onglet **Actions** → Cliquer sur le workflow en cours → Bouton **Cancel workflow**.

---

### 5.1 Créer le fichier workflow

```bash
# Créer la structure des dossiers
mkdir -p .github/workflows

# Créer le fichier workflow
touch .github/workflows/deploy-github-pages.yml
```

### 5.2 Configuration du workflow

Copier ce code dans `.github/workflows/deploy-github-pages.yml` :

```yaml
# Nom du workflow affiché dans l'onglet Actions de GitHub
name: Deploy to GitHub Pages (Staging)

# Déclencheurs : quand ce workflow s'exécute-t-il ?
on:
  # Se déclenche automatiquement à chaque push sur la branche main
  push:
    branches: ["main"]

  # Permet de déclencher manuellement depuis l'onglet Actions
  workflow_dispatch:

# Permissions nécessaires pour déployer sur GitHub Pages
# GitHub crée automatiquement un jeton (GITHUB_TOKEN) avec ces permissions
permissions:
  contents: read      # Lire le code du dépôt
  pages: write        # Écrire sur GitHub Pages
  id-token: write     # Créer un jeton d'identité (sécurité)

# Gestion de la concurrence : évite les déploiements simultanés
concurrency:
  group: "pages"                  # Groupe tous les déploiements Pages ensemble
  cancel-in-progress: false       # Ne pas annuler un déploiement en cours

# Jobs : tâches à exécuter (ici 2 jobs : build et deploy)
jobs:
  # ========================================
  # JOB 1 : Construire le site statique
  # ========================================
  build:
    # Système d'exploitation de la machine virtuelle
    runs-on: ubuntu-latest

    # Liste des étapes à exécuter dans l'ordre
    steps:
      # Étape 1 : Récupérer le code source du dépôt
      - name: Checkout
        uses: actions/checkout@v4

      # Étape 2 : Installer Node.js (nécessaire pour Nuxt)
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "20"    # Version LTS de Node.js
          cache: 'npm'          # Cache les dépendances npm pour accélérer

      # Étape 3 : Installer les dépendances du projet
      # npm ci = installation propre basée sur package-lock.json
      - name: Install dependencies
        run: npm ci

      # Étape 4 : Générer le site statique (HTML/CSS/JS)
      # Nuxt crée les fichiers dans .output/public/
      - name: Static HTML export with Nuxt
        run: npm run generate
        env:
          # IMPORTANT : Définit le sous-dossier pour GitHub Pages
          NUXT_APP_BASE_URL: /<nom-du-depot>/

      # Étape 5 : Créer une archive (artifact) des fichiers générés
      # Cette archive sera utilisée par le job de déploiement
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./.output/public    # Dossier contenant le site généré

  # ========================================
  # JOB 2 : Déployer sur GitHub Pages
  # ========================================
  deploy:
    # Configuration de l'environnement
    environment:
      name: github-pages                              # Nom de l'environnement
      url: ${{ steps.deployment.outputs.page_url }}   # URL du site déployé

    # Système d'exploitation
    runs-on: ubuntu-latest

    # Ce job ne démarre qu'après la réussite du job 'build'
    needs: build

    # Étapes du déploiement
    steps:
      # Étape unique : Déployer l'artifact sur GitHub Pages
      # GitHub hébergera alors le site à l'URL configurée
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
git add .github/workflows/deploy-github-pages.yml public/.nojekyll

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

### 🔧 Problèmes d'installation (Prérequis)

#### "Command not found: git"

**Signification** : Git n'est pas installé sur votre ordinateur.

**Solution :**

**Windows :**
1. Télécharger [Git for Windows](https://git-scm.com/download/win)
2. Installer avec les options par défaut
3. Redémarrer le terminal

**macOS :**
1. Ouvrir Terminal
2. Taper `git` → Installation automatique proposée par Xcode Command Line Tools
3. Ou installer via Homebrew : `brew install git`

**Linux (Ubuntu/Debian) :**
```bash
sudo apt update
sudo apt install git
```

**Vérifier l'installation** :
```bash
git --version
# Devrait afficher : git version 2.x.x
```

---

#### "npm: command not found" ou "node: command not found"

**Signification** : Node.js et npm ne sont pas installés.

**Solution :**
1. Aller sur https://nodejs.org
2. Télécharger la version **LTS** (Long Term Support) - actuellement Node.js 20+
3. Installer
4. **Redémarrer complètement votre terminal** (important !)

**Vérifier l'installation** :
```bash
node --version
# Devrait afficher : v20.x.x ou supérieur

npm --version
# Devrait afficher : 10.x.x ou supérieur
```

**Si ça ne fonctionne toujours pas** :
- Windows : Vérifier que Node.js est dans le PATH (variables d'environnement)
- macOS/Linux : Vérifier le PATH dans `~/.bashrc` ou `~/.zshrc`

---

#### "Permission denied" sur macOS/Linux

**Signification** : Problème de permissions fichiers.

**⚠️ NE PAS utiliser `sudo` avec npm !**

**Solution recommandée** : Réparer les permissions npm
```bash
# Donner la propriété du dossier npm à votre utilisateur
sudo chown -R $USER ~/.npm
sudo chown -R $USER /usr/local/lib/node_modules
```

**Alternative** : Utiliser un gestionnaire de versions Node (recommandé pour éviter ce problème)
- macOS/Linux : [nvm](https://github.com/nvm-sh/nvm)
- Windows : [nvm-windows](https://github.com/coreybutler/nvm-windows)

---

### 🐛 Problèmes Git

#### "fatal: not a git repository"

**Signification** : Vous n'êtes pas dans un dossier Git, ou Git n'a pas été initialisé.

**Solution :**
1. Vérifier que vous êtes dans le bon dossier :
   ```bash
   pwd  # Affiche le chemin actuel
   ```

2. Aller dans le dossier de votre projet :
   ```bash
   cd mon-projet-nuxt
   ```

3. Vérifier la présence du dossier `.git` :
   ```bash
   ls -la | grep .git
   ```

4. Si `.git` n'existe pas, initialiser Git :
   ```bash
   git init
   ```

---

#### "remote: Repository not found" lors du push

**Causes possibles :**

**1. URL du dépôt incorrecte**
```bash
# Vérifier l'URL configurée
git remote -v

# Si incorrecte, la corriger
git remote set-url origin https://github.com/votre-username/votre-depot.git
```

**2. Dépôt GitHub pas encore créé**
- Aller sur https://github.com/new
- Créer le dépôt
- Puis réessayer le push

**3. Problème d'authentification GitHub**
- Depuis août 2021, GitHub n'accepte plus les mots de passe
- Utiliser un **Personal Access Token** ou **SSH**

**Créer un Personal Access Token :**
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token → Cocher `repo` → Generate
3. **Copier le token** (vous ne le reverrez plus !)
4. Utiliser ce token comme mot de passe lors du push

---

#### "Updates were rejected because the tip of your current branch is behind"

**Signification** : La version distante est plus récente que votre version locale.

**Solution** :
```bash
# Récupérer les changements distants
git pull origin main

# Résoudre les conflits éventuels (si demandé)
# Puis recommencer le push
git push origin main
```

---

### 🎨 Problèmes d'affichage du site

#### Le site s'affiche blanc / complètement vide

**Causes possibles :**

**1. Fichier `.nojekyll` manquant (UNIQUEMENT pour GitHub Pages)**

⚠️ **Ce problème concerne UNIQUEMENT GitHub Pages, pas le déploiement SFTP !**

Si votre site de **test** sur GitHub Pages est blanc, mais que votre site en **production** (SFTP) fonctionne :
→ C'est probablement le fichier `.nojekyll` qui manque.

**Vérification et correction :**
```bash
# Vérifier sa présence
ls public/.nojekyll

# Si absent, le créer
mkdir -p public
touch public/.nojekyll

# Puis commit et push
git add public/.nojekyll
git commit -m "fix: add .nojekyll file for GitHub Pages"
git push origin main
```

**Comment confirmer que c'est bien le problème :**
1. Ouvrir votre site GitHub Pages (F12 pour DevTools)
2. Onglet **Console** : Erreurs 404 sur `_nuxt/app.js` ?
3. Onglet **Network** : Fichiers `_nuxt/*` en rouge (404) ?
4. → Oui = `.nojekyll` manquant ✅

**2. baseURL incorrect**
- Vérifier dans `.github/workflows/deploy-github-pages.yml` ligne `NUXT_APP_BASE_URL`
- Doit être : `/nom-exact-du-depot/` (avec `/` au début ET à la fin)
- Exemple : Si votre dépôt s'appelle `mon-site`, utiliser `/mon-site/`

**3. GitHub Pages pas activé**
1. Aller sur votre dépôt GitHub
2. Settings → Pages
3. Source : **GitHub Actions** (pas "Deploy from a branch")

---

#### Le site s'affiche sans styles (CSS)

**Cause** : Le `baseURL` est incorrect.

**Solution :**
1. Vérifier `NUXT_APP_BASE_URL` dans `.github/workflows/deploy-github-pages.yml`
2. Le format doit être : `/nom-du-depot/` (avec les `/` au début et à la fin)

**Exemples :**
```yaml
# ✅ Correct
NUXT_APP_BASE_URL: /mon-projet-nuxt/

# ❌ Incorrect
NUXT_APP_BASE_URL: mon-projet-nuxt/    # Manque / au début
NUXT_APP_BASE_URL: /mon-projet-nuxt    # Manque / à la fin
NUXT_APP_BASE_URL: mon-projet-nuxt     # Manque les deux /
```

3. Après correction, commit et push :
```bash
git add .github/workflows/deploy-github-pages.yml
git commit -m "fix: correct baseURL format"
git push origin main
```

---

#### Erreurs 404 sur les assets (images, CSS, JS)

**⚠️ Important :** Identifier d'abord sur quel environnement le problème se produit :

- 🧪 **GitHub Pages** : Plusieurs causes possibles (voir ci-dessous)
- 🚀 **SFTP Production** : Probablement pas lié à `.nojekyll` (voir autres causes)

**Solutions à essayer dans l'ordre :**

**1. Vérifier `.nojekyll` (GitHub Pages uniquement)**

Si les erreurs 404 concernent des fichiers dans `_nuxt/` (ex: `_nuxt/app.js`, `_nuxt/app.css`) :
```bash
ls public/.nojekyll
# Si absent, le créer (voir section ci-dessus)
```

⚠️ **Note :** Cette cause est **impossible** sur SFTP, car les serveurs SFTP ne filtrent pas les dossiers `_`.

**2. Vérifier le baseURL** (voir section "Le site s'affiche sans styles")

**3. Vider le cache du navigateur**
- Chrome/Edge : `Ctrl + Shift + Suppr` (Windows) ou `Cmd + Shift + Delete` (Mac)
- Cocher "Images et fichiers en cache"
- Vider

**4. Forcer le redéploiement**
```bash
# Créer un commit vide pour redéclencher le workflow
git commit --allow-empty -m "chore: trigger redeployment"
git push origin main
```

---

### ⚙️ Problèmes GitHub Actions

#### Le déploiement échoue

**Vérifier dans l'ordre :**

1. **Aller voir les logs détaillés**
   - GitHub → Actions → Cliquer sur le workflow échoué
   - Cliquer sur le job en rouge
   - Lire le message d'erreur

2. **Vérifier la configuration**
   - ✅ `NUXT_APP_BASE_URL` correspond au nom exact de votre dépôt
   - ✅ GitHub Pages est activé (Settings → Pages → Source: GitHub Actions)
   - ✅ Le fichier `.nojekyll` existe dans `public/`

3. **Erreurs courantes et solutions :**

**Erreur : "Process completed with exit code 1" lors de npm ci**
```
Cause : package-lock.json pas synchronisé
Solution :
  rm package-lock.json
  npm install
  git add package-lock.json
  git commit -m "fix: regenerate package-lock"
  git push origin main
```

**Erreur : "Missing script: generate"**
```
Cause : package.json n'a pas le script "generate"
Solution : Vérifier que package.json contient :
  "scripts": {
    "generate": "nuxt generate"
  }
```

**Erreur : "EACCES: permission denied"**
```
Cause : Problème de cache npm dans GitHub Actions
Solution : Dans le workflow, ajouter après "Setup Node" :
  - name: Clear npm cache
    run: npm cache clean --force
```

---

#### Le workflow ne se déclenche pas

**Vérifications :**

1. **Le fichier workflow est-il au bon endroit ?**
   ```
   .github/
     └── workflows/
           └── deploy-github-pages.yml  ✅
   ```

2. **Le nom de la branche est-il correct ?**
   - Ouvrir `.github/workflows/deploy-github-pages.yml`
   - Vérifier la section `on: push: branches:`
   - Si votre branche s'appelle `master` au lieu de `main`, adapter

3. **Le workflow est-il activé ?**
   - GitHub → Actions → Vérifier qu'il n'y a pas de message "Workflows disabled"
   - Si désactivé : Settings → Actions → General → "Allow all actions"

4. **Déclenchement manuel**
   - GitHub → Actions → Deploy to GitHub Pages → Run workflow

---

### 🌐 Problèmes spécifiques au navigateur

#### Le site fonctionne en local mais pas sur GitHub Pages

**Checklist complète :**

```
☐ Fichier .nojekyll présent dans public/
☐ baseURL configuré correctement dans le workflow
☐ GitHub Pages activé avec source "GitHub Actions"
☐ Workflow a réussi (onglet Actions → tout en vert)
☐ Attendre 2-3 minutes après le déploiement (propagation DNS)
☐ Vider le cache du navigateur
☐ Essayer en navigation privée
☐ Essayer avec un autre navigateur
```

**Si toujours cassé, regarder la console du navigateur :**
1. Ouvrir le site
2. Appuyer sur `F12` (ouvrir les DevTools)
3. Onglet "Console"
4. Chercher les erreurs en rouge
5. Noter les erreurs 404 (fichiers non trouvés)

---

### 💡 Obtenir de l'aide

**Si vous êtes bloqué :**

1. **Vérifier l'onglet Actions sur GitHub**
   - Cliquer sur le workflow échoué
   - Lire les logs en détail
   - Copier le message d'erreur exact

2. **Vérifier la console du navigateur** (F12)
   - Onglet Console : erreurs JavaScript
   - Onglet Network : fichiers 404

3. **Comparer avec le dépôt exemple**
   - Comparer votre code avec le dépôt de départ
   - Vérifier les noms de fichiers, chemins, configuration

4. **Demander de l'aide avec contexte**
   - Message d'erreur exact
   - Capture d'écran des logs GitHub Actions
   - Lien vers votre dépôt (s'il est public)
   - Ce que vous avez déjà essayé

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

**💡 Astuce : Comment trouver le chemin du dossier racine ?**

Le chemin du dossier web varie selon les hébergeurs. Voici comment le trouver :

1. **Via le panneau de contrôle (cPanel, Plesk, etc.) :**
   - Connectez-vous à votre panneau de contrôle
   - Cherchez "Gestionnaire de fichiers" ou "File Manager"
   - Le dossier public est généralement affiché en premier

2. **Chemins courants selon les hébergeurs :**
   - **Infomaniak, OVH, O2switch :** `/public_html/`
   - **Hostinger, GoDaddy :** `/public_html/`
   - **1&1 IONOS :** `/` (racine directe)
   - **Planethoster :** `/public_html/`
   - **Alwaysdata :** `/www/`
   - **Gandi :** `/htdocs/`

3. **Via un client SFTP (FileZilla, Cyberduck) :**
   - Connectez-vous avec vos identifiants
   - Cherchez un dossier nommé `public_html`, `www`, `htdocs`, ou `web`
   - C'est là que vous devez déposer vos fichiers web

4. **Test simple :**
   - Uploadez un fichier `test.html` dans différents dossiers
   - Essayez d'y accéder via `https://votredomaine.com/test.html`
   - Le bon dossier est celui où le fichier est accessible publiquement

**⚠️ Important :** Notez le chemin COMPLET (ex: `/public_html/` et non `public_html/`)

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

---

### 🔒 7.2.1 Sécurité du déploiement SFTP

**Pourquoi SFTP avec mot de passe ?**

Notre configuration utilise SFTP (Secure File Transfer Protocol) avec authentification par mot de passe. Voici pourquoi c'est le bon choix pour ce projet :

#### ✅ Avantages de notre configuration :

1. **Transfert chiffré** 🔐
   - Contrairement à FTP classique (non sécurisé), SFTP chiffre TOUTES les données
   - Vos fichiers et identifiants sont protégés pendant le transfert
   - Utilise le protocole SSH sous-jacent (port 22)

2. **Pas d'accès shell au serveur** 🛡️
   - Grâce au paramètre `sftp_only: true` dans le workflow
   - Limite l'accès au transfert de fichiers uniquement
   - Empêche l'exécution de commandes sur le serveur

3. **Sécurité suffisante pour du contenu statique** 📄
   - Nuxt `generate` crée des fichiers HTML/CSS/JS statiques localement
   - Pas besoin d'exécution de code sur le serveur
   - Simple transfert de fichiers = risques minimisés

#### ❌ Pourquoi PAS de clé SSH privée ?

Nous n'utilisons **PAS** de clé SSH privée car :

- **Risque élevé si GitHub Actions est compromis :**
  - Une clé SSH privée donnerait un accès shell COMPLET au serveur
  - Permettrait d'exécuter n'importe quelle commande sur votre hébergement
  - Pourrait compromettre tout le serveur, pas seulement votre site

- **Inutile pour notre cas d'usage :**
  - Nous déployons uniquement des fichiers statiques
  - Pas besoin de scripts d'exécution côté serveur
  - Le mot de passe SFTP suffit largement

#### ❌ Pourquoi PAS de FTP classique ?

Le FTP classique (port 21) est **DÉCONSEILLÉ** car :

- ❌ **Pas de chiffrement** : Mot de passe et fichiers envoyés en clair
- ❌ **Facilement interceptable** : Attaque "man-in-the-middle" possible
- ❌ **Standard obsolète** : Remplacé par SFTP/FTPS depuis des années

#### 📊 Comparatif de sécurité :

| Méthode | Chiffrement | Accès shell | Sécurité | Recommandation |
|---------|-------------|-------------|----------|----------------|
| **FTP** | ❌ Non | ❌ Non | 🔴 Faible | ❌ Éviter |
| **FTPS** | ✅ Oui | ❌ Non | 🟡 Moyenne | ⚠️ Acceptable |
| **SFTP (mot de passe)** | ✅ Oui | ❌ Non* | 🟢 Bonne | ✅ **Recommandé** |
| **SFTP (clé SSH)** | ✅ Oui | ✅ Oui | 🟡 Risqué** | ⚠️ Surpuissant |

*Avec `sftp_only: true`
**Risqué si GitHub Actions compromis

#### 🛡️ Que se passe-t-il si les credentials sont compromis ?

Avec notre configuration SFTP actuelle :

- ✅ **Dégâts limités** : Accès uniquement aux fichiers de votre site web
- ✅ **Pas d'accès shell** : Impossible d'exécuter des commandes sur le serveur
- ✅ **Facile à réparer** : Changer le mot de passe SFTP dans GitHub Secrets
- ✅ **Pas de propagation** : Le reste du serveur reste protégé

Avec une clé SSH privée (non utilisée ici) :

- ❌ **Accès shell complet** : Contrôle total du serveur
- ❌ **Risque de backdoor** : Installation de logiciels malveillants possible
- ❌ **Difficile à nettoyer** : Nécessite investigation complète du serveur
- ❌ **Propagation possible** : Accès à d'autres sites sur le même serveur

#### 🎓 Enseignement pour les apprentis :

**Règle d'or en sécurité :**
> "Donner uniquement les permissions minimales nécessaires"

Pour déployer des fichiers statiques :
- ✅ SFTP avec mot de passe = permissions minimales suffisantes
- ❌ Clé SSH privée = permissions excessives (overkill)

**Analogie :**
- SFTP = Clé de la boîte aux lettres (déposer du courrier)
- SSH = Clés de la maison (accès à toutes les pièces)

Pour déposer du courrier, une clé de boîte aux lettres suffit ! 📬

---

### 7.3 Créer le workflow de production

Créer le fichier `.github/workflows/deploy-production.yml` :

```yaml
# Nom du workflow affiché dans l'onglet Actions de GitHub
name: Deploy to Production (SFTP)

# Déclencheurs : quand ce workflow s'exécute-t-il ?
on:
  # OPTION 1 : Déclenché lors de la création d'un tag Git
  # Exemple : git tag v1.0.0 && git push origin v1.0.0
  # Pratique pour déploiements rapides sans documentation formelle
  push:
    tags:
      - 'v*.*.*'  # Correspond à v1.0.0, v2.1.3, v0.5.2, etc.

  # OPTION 2 : Déclenché lorsqu'une release est publiée sur GitHub
  # Créer une release via https://github.com/.../releases/new
  # Recommandé pour versions majeures avec changelog et documentation
  release:
    types: [published]

  # OPTION 3 : Déclenchement manuel depuis l'onglet Actions
  # Utile en cas d'urgence ou pour redéployer sans créer de tag/release
  workflow_dispatch:

# Jobs : tâches à exécuter
jobs:
  # ========================================
  # JOB : Déployer en production via SFTP
  # ========================================
  deploy-production:
    # Système d'exploitation de la machine virtuelle
    runs-on: ubuntu-latest

    # Configuration de l'environnement de production
    environment:
      name: production                    # Nom de l'environnement
      url: ${{ vars.PRODUCTION_URL }}     # URL du site de production (configurable dans GitHub)

    # Liste des étapes à exécuter dans l'ordre
    steps:
      # Étape 1 : Récupérer le code source du dépôt
      - name: Checkout
        uses: actions/checkout@v4

      # Étape 2 : Installer Node.js (nécessaire pour Nuxt)
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "20"    # Version LTS de Node.js
          cache: 'npm'          # Cache les dépendances npm pour accélérer

      # Étape 3 : Installer les dépendances du projet
      # npm ci = installation propre basée sur package-lock.json
      - name: Install dependencies
        run: npm ci

      # Étape 4 : Générer le site statique pour la production
      # Nuxt crée les fichiers optimisés dans .output/public/
      # NODE_ENV=production active les optimisations (minification, etc.)
      - name: Generate static site for production
        run: npm run generate
        env:
          NODE_ENV: production    # Mode production (optimisations activées)

      # Étape 5 : Déployer les fichiers sur le serveur de production via SFTP
      # Les identifiants sont stockés de manière sécurisée dans GitHub Secrets
      - name: Deploy to Production via SFTP
        uses: wlixcc/SFTP-Deploy-Action@v1.2.4
        with:
          # Adresse du serveur SFTP (ex: sftp.votrehebergeur.com)
          server: ${{ secrets.SFTP_SERVER }}

          # Nom d'utilisateur SFTP fourni par votre hébergeur
          username: ${{ secrets.SFTP_USERNAME }}

          # Mot de passe SFTP (stocké de manière sécurisée)
          password: ${{ secrets.SFTP_PASSWORD }}

          # Port de connexion SFTP (généralement 22 pour SSH/SFTP)
          # || 22 signifie : utiliser 22 par défaut si SFTP_PORT n'est pas défini
          port: ${{ secrets.SFTP_PORT || 22 }}

          # Dossier LOCAL à uploader (le ./ final = uploader le CONTENU)
          # ./.output/public/./ signifie : tout le contenu de .output/public/
          local_path: './.output/public/./'

          # Dossier DISTANT de destination (ex: /public_html/)
          remote_path: ${{ secrets.SFTP_SERVER_DIR }}

          # Utiliser SFTP uniquement (pas d'accès shell)
          # Important pour la sécurité : limite l'accès au transfert de fichiers
          sftp_only: true

          # Ne PAS supprimer les fichiers distants avant upload
          # Évite la perte de données en cas d'erreur
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

## 📖 Glossaire DevOps pour débutants

### A

**Artifact (Artefact)**
: Archive temporaire de fichiers créée pendant un workflow CI/CD. Permet de transférer des fichiers entre différents jobs d'un workflow.
: *Exemple* : Les fichiers compilés de votre site sont mis dans un artifact pour être déployés.

### B

**baseURL**
: Chemin racine de votre application web.
: *Exemples* : `/` (racine du domaine) ou `/mon-projet/` (sous-dossier)

**Branch (Branche)**
: Version parallèle de votre code dans Git. Permet de travailler sur plusieurs fonctionnalités en même temps.
: *Exemple* : branche `main` (principale), branche `feature/login` (nouvelle fonctionnalité)

**Build (Construction)**
: Processus de compilation et transformation du code source en fichiers prêts pour la production.
: *Exemple* : `npm run build` compile votre projet Nuxt

### C

**CI/CD**
: **Continuous Integration** / **Continuous Deployment**
: - **CI** = Intégration Continue : Tester automatiquement chaque modification
: - **CD** = Déploiement Continu : Déployer automatiquement après les tests
: *Avantage* : Automatisation = moins d'erreurs humaines

**Commit**
: Sauvegarde d'un état de votre code dans Git avec un message descriptif.
: *Analogie* : Photo instantanée de votre projet à un moment précis

**Concurrency (Concurrence)**
: Gestion de plusieurs processus qui s'exécutent en même temps.
: *Exemple* : Éviter que 2 déploiements se fassent simultanément

### D

**Déploiement**
: Action de mettre votre site/application en ligne (accessible sur internet).
: *Synonymes* : Mise en ligne, publication, deployment

**Dépôt (Repository)**
: Projet complet avec son code et tout l'historique Git.
: *Types* : Dépôt local (votre ordinateur) vs dépôt distant (GitHub)

### E

**Environnement**
: Contexte d'exécution d'une application avec sa configuration spécifique.
: *Exemples* :
:   - **Développement** : Votre ordinateur (npm run dev)
:   - **Staging/Test** : Serveur de test (GitHub Pages)
:   - **Production** : Serveur accessible au public (SFTP)

**env (Variables d'environnement)**
: Paramètres de configuration qui changent selon l'environnement.
: *Exemple* : `process.env.NUXT_APP_BASE_URL`

### G

**GitHub Actions**
: Service d'automatisation de GitHub pour exécuter des workflows (compilation, tests, déploiement).
: *Alternative à* : Deploy from a branch (méthode moins flexible)

**GitHub Pages**
: Service d'hébergement gratuit de sites statiques fourni par GitHub.
: *Limites* : Sites statiques uniquement (pas de base de données, pas de serveur backend)

**Generate (Génération)**
: Créer une version statique (HTML/CSS/JS) d'une application.
: *Exemple* : `npm run generate` crée les fichiers dans `.output/public/`

### J

**Jekyll**
: Générateur de sites statiques utilisé par défaut par GitHub Pages.
: *Note* : On le désactive avec `.nojekyll` pour les projets Nuxt

**Job**
: Ensemble de tâches (steps) dans un workflow GitHub Actions.
: *Exemple* : Job "build" + Job "deploy"

### L

**Linting**
: Analyse automatique du code pour détecter erreurs et non-conformités au style.
: *Outil* : ESLint pour JavaScript/TypeScript

### N

**Node.js**
: Environnement d'exécution JavaScript côté serveur.
: *Nécessaire pour* : Nuxt, npm, compilation

**npm**
: **Node Package Manager** : Gestionnaire de packages JavaScript.
: *Commandes courantes* : `npm install`, `npm run dev`, `npm run build`

**npx**
: Exécute des packages npm sans installation permanente.
: *Différence avec npm* : `npm install` = installer | `npx` = exécuter temporairement

**Nuxt**
: Framework basé sur Vue.js pour créer des applications web modernes.
: *Modes* : SSR (Server-Side Rendering), SPA, SSG (Static Site Generation)

### P

**Package**
: Module de code réutilisable (bibliothèque, framework).
: *Exemples* : `@nuxt/ui`, `vue`, `typescript`

**Pipeline**
: Séquence automatisée d'étapes (build, test, deploy).
: *Synonyme* : Workflow CI/CD

**Production**
: Environnement accessible par les utilisateurs finaux (le "vrai" site en ligne).
: *Opposé de* : Développement, Test/Staging

### R

**Remote (Distant)**
: Dépôt Git hébergé sur un serveur (GitHub, GitLab, etc.).
: *Commandes* : `git remote add`, `git push`, `git pull`

**Repository**
: Voir "Dépôt"

### S

**Secret**
: Donnée sensible stockée de manière sécurisée (mot de passe, clé API).
: *Dans GitHub* : Settings → Secrets and variables → Actions

**SFTP**
: **Secure File Transfer Protocol** : Protocole de transfert de fichiers sécurisé (chiffré).
: *Différence avec FTP* : SFTP = chiffré ✅ | FTP = non chiffré ❌

**SSH**
: **Secure Shell** : Protocole de connexion sécurisée à distance.
: *Utilise le port* : 22 (généralement)

**Staging**
: Environnement de test qui ressemble à la production.
: *Exemple* : GitHub Pages comme staging avant déploiement SFTP production

**Static Site (Site statique)**
: Site composé uniquement de fichiers HTML/CSS/JS (pas de serveur, pas de base de données).
: *Avantages* : Rapide, sécurisé, hébergement gratuit possible

**Step (Étape)**
: Action individuelle dans un job de workflow.
: *Exemples* : "Checkout code", "Install dependencies", "Run tests"

### T

**Tag**
: Marqueur Git pour identifier une version spécifique du code.
: *Format* : Semantic Versioning (ex: `v1.0.0`, `v2.3.1`)

**Token**
: Clé d'authentification temporaire ou permanente.
: *Exemple* : `GITHUB_TOKEN` (créé automatiquement par GitHub Actions)

### W

**Workflow**
: Ensemble automatisé d'étapes définies dans un fichier YAML.
: *Localisation* : `.github/workflows/`
: *Déclencheurs* : push, pull request, tag, manuel, planifié

### Y

**YAML**
: **YAML Ain't Markup Language** : Format de fichier de configuration lisible par les humains.
: *Extension* : `.yml` ou `.yaml`
: *Utilisé pour* : Workflows GitHub Actions, configuration Docker, etc.

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
