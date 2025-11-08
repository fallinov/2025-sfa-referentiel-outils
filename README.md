# 2025 Steve Fallet - Référentiel des Outils

[![Nuxt UI](https://img.shields.io/badge/Made%20with-Nuxt%20UI-00DC82?logo=nuxt&labelColor=020420)](https://ui.nuxt.com)

Application web référençant les outils utilisés en formation par Steve Fallet, développée avec [Nuxt UI](https://ui.nuxt.com).

> **📝 Note pour les apprentis :** Dans ce document, remplacez `<votre-compte>` par votre nom d'utilisateur GitHub.
> Par exemple, si votre compte est `jean-dupont`, l'URL sera : `https://github.com/jean-dupont/2025-sfa-nuxt-devops`

## 📚 Table des matières

- [Installation](#installation)
- [Développement](#développement)
- [Stratégie de déploiement DevOps](#-stratégie-de-déploiement-devops)
- [Guide pour les apprentis](#-guide-pour-les-apprentis)
- [Configuration technique](#configuration-technique)

---

## Installation

Installer les dépendances du projet :

```bash
pnpm install
```

---

## Développement

Démarrer le serveur de développement sur `http://localhost:3000` :

```bash
pnpm dev
```

### Autres commandes utiles

```bash
# Vérifier le code (linting)
pnpm run lint

# Vérifier les types TypeScript
pnpm run typecheck

# Générer le site statique
pnpm run generate

# Prévisualiser la version de production localement
pnpm run preview
```

---

## 🚀 Stratégie de déploiement DevOps

Ce projet utilise une approche **trunk-based development** avec déploiements automatisés vers deux environnements distincts.

### 📊 Les deux environnements

| Environnement | URL | Déclencheur | Méthode |
|---------------|-----|-------------|---------|
| **🧪 Test (Staging)** | `https://<votre-compte>.github.io/2025-sfa-nuxt-devops/` | Push sur `main` | GitHub Pages |
| **🚀 Production** | Votre domaine de production | Tag ou Release | SFTP |

### 🔄 Workflow de développement

```
┌─────────────────────────────────────────────────────┐
│                 Cycle de développement               │
├─────────────────────────────────────────────────────┤
│                                                      │
│  1️⃣  Développement local                             │
│      ↓ pnpm dev                                      │
│      ↓ Modifications du code                        │
│      ↓                                               │
│  2️⃣  Commit et push vers GitHub                      │
│      ↓ git add . && git commit -m "..."             │
│      ↓ git push origin main                         │
│      ↓                                               │
│  3️⃣  Déploiement automatique TEST                    │
│      → GitHub Pages (staging)                       │
│      → URL de test accessible                       │
│      ↓                                               │
│  4️⃣  Tests et validation                             │
│      ↓ Vérification par l'équipe                    │
│      ↓                                               │
│  5️⃣  Mise en production (au choix)                   │
│      → OPTION A : Tag rapide                        │
│      → OPTION B : Release documentée                │
│      ↓                                               │
│  6️⃣  Déploiement automatique PRODUCTION              │
│      → Serveur SFTP                                 │
│      → Site public accessible                       │
│                                                      │
└─────────────────────────────────────────────────────┘
```

---

## 🎓 Guide pour les apprentis

### Étape 1 : Développer et tester localement

```bash
# Lancer le serveur de développement
pnpm dev

# Modifier le code dans votre éditeur
# Vérifier les changements sur http://localhost:3000
```

### Étape 2 : Publier sur l'environnement de test

```bash
# Ajouter vos modifications
git add .

# Créer un commit avec un message clair
git commit -m "feat: ajouter nouvelle fonctionnalité"

# Envoyer vers GitHub
git push origin main
```

✅ **Résultat :** Le site est automatiquement déployé sur GitHub Pages (test)
- Vérifier le déploiement : `https://github.com/<votre-compte>/2025-sfa-nuxt-devops/actions`
- Tester le site : `https://<votre-compte>.github.io/2025-sfa-nuxt-devops/`

### Étape 3 : Mettre en production

Une fois que tout fonctionne bien en test, vous avez **deux méthodes** pour publier en production :

#### 🏃 **MÉTHODE A : Déploiement rapide avec un tag** (recommandé pour usage quotidien)

```bash
# Créer un tag de version (suivre le format v1.0.0)
git tag v1.0.0

# Envoyer le tag vers GitHub
git push origin v1.0.0
```

✅ **Résultat :** Déploiement automatique sur le serveur de production via SFTP

**Quand utiliser cette méthode :**
- ✅ Corrections de bugs
- ✅ Petites améliorations
- ✅ Déploiements fréquents
- ✅ Vous voulez aller vite

---

#### 📖 **MÉTHODE B : Déploiement documenté avec une release** (recommandé pour versions importantes)

```bash
# 1. Créer et envoyer un tag (si pas déjà fait)
git tag v2.0.0
git push origin v2.0.0

# 2. Créer une release avec documentation
# Option 1 : Via l'interface GitHub
#   → Aller sur https://github.com/<votre-compte>/2025-sfa-nuxt-devops/releases/new
#   → Sélectionner le tag v2.0.0
#   → Ajouter un titre et des notes de version
#   → Cliquer sur "Publish release"

# Option 2 : Via la ligne de commande (GitHub CLI)
gh release create v2.0.0 \
  --title "Version 2.0.0 - Nouvelle interface" \
  --notes "## 🎉 Nouveautés
- Nouvelle interface utilisateur
- Amélioration des performances
- Correction de 5 bugs

## 📝 Détails techniques
- Migration vers Nuxt 4
- Ajout de nouveaux composants"
```

✅ **Résultat :**
- Déploiement automatique sur le serveur de production via SFTP
- **BONUS :** Page de release publique avec changelog et documentation

**Quand utiliser cette méthode :**
- ✅ Versions majeures (v1.0.0, v2.0.0)
- ✅ Nouvelles fonctionnalités importantes
- ✅ Communication publique nécessaire
- ✅ Documentation pour les utilisateurs

---

### 📋 Comprendre les numéros de version (Semantic Versioning)

Format : `vMAJEUR.MINEUR.PATCH`

```
v1.2.3
│ │ │
│ │ └─── PATCH : Corrections de bugs (1.2.3 → 1.2.4)
│ └───── MINEUR : Nouvelles fonctionnalités (1.2.0 → 1.3.0)
└─────── MAJEUR : Changements incompatibles (1.0.0 → 2.0.0)
```

**Exemples :**
- `v0.0.1` → Première version de test
- `v1.0.0` → Première version stable
- `v1.1.0` → Ajout d'une nouvelle page
- `v1.1.1` → Correction d'un bug
- `v2.0.0` → Refonte complète de l'interface

---

### 🔍 Vérifier le statut des déploiements

#### Voir l'historique des déploiements :
👉 `https://github.com/<votre-compte>/2025-sfa-nuxt-devops/actions`

#### Voir toutes les versions publiées :
👉 `https://github.com/<votre-compte>/2025-sfa-nuxt-devops/releases`

#### Voir tous les tags créés :
```bash
git tag -l
```

---

## Configuration technique

### 🎨 Scripts de génération disponibles

```bash
# Générer pour GitHub Pages (avec sous-dossier)
pnpm run generate:github

# Générer pour production (à la racine du domaine)
pnpm run generate:prod

# Génération standard (utilise variable d'environnement)
pnpm run generate
```

### 🔐 Configuration des secrets GitHub (pour l'enseignant)

Pour que le déploiement SFTP fonctionne, configurer ces secrets dans GitHub :

1. Aller sur : `Settings` → `Secrets and variables` → `Actions`
2. Ajouter les secrets suivants :

| Secret | Description | Exemple |
|--------|-------------|---------|
| `SFTP_SERVER` | Adresse du serveur SFTP | `ftp.votredomaine.com` |
| `SFTP_USERNAME` | Nom d'utilisateur SFTP | `votre_user` |
| `SFTP_PASSWORD` | Mot de passe SFTP | `VotreMdP123!` |
| `SFTP_SERVER_DIR` | Dossier de destination | `/public_html/` |
| `SFTP_PORT` | Port SFTP (optionnel) | `21` ou `22` |

### 🌐 Variables d'environnement

Le projet utilise des variables d'environnement pour gérer les différents déploiements :

```bash
# Par défaut (production à la racine)
NUXT_APP_BASE_URL=/

# Pour GitHub Pages (sous-dossier)
NUXT_APP_BASE_URL=/2025-sfa-nuxt-devops/
```

---

## 📁 Structure des workflows CI/CD

```
.github/workflows/
├── deploy-github-pages.yml  # Déploiement automatique sur GitHub Pages (test)
└── deploy-sftp.yml           # Déploiement automatique via SFTP (production)
```

Ces workflows sont entièrement commentés en français pour faciliter la compréhension.

---

## 🆘 Dépannage

### Le déploiement ne se déclenche pas

**Vérifier que :**
- ✅ Le tag est bien poussé sur GitHub : `git ls-remote --tags origin`
- ✅ Les secrets SFTP sont configurés dans GitHub Settings
- ✅ Le format du tag est correct : `v1.0.0` (pas `1.0.0`)

### Voir les logs d'un déploiement qui a échoué

1. Aller sur `https://github.com/<votre-compte>/2025-sfa-nuxt-devops/actions`
2. Cliquer sur le workflow qui a échoué
3. Lire les logs pour identifier l'erreur

---

## 📖 Ressources

- [Documentation Nuxt](https://nuxt.com/docs)
- [Documentation Nuxt UI](https://ui.nuxt.com)
- [Guide GitHub Actions](https://docs.github.com/en/actions)
- [Semantic Versioning](https://semver.org/lang/fr/)
- [Trunk-Based Development](https://trunkbaseddevelopment.com/)

---

## 🤝 Contribution

Ce projet est utilisé dans un cadre pédagogique. Les apprentis sont encouragés à :
1. Créer des branches pour leurs fonctionnalités
2. Tester localement avant de pusher
3. Faire des commits clairs et descriptifs
4. Utiliser les pull requests pour les changements importants

---

**Made with ❤️ for Steve Fallet apprentices**
