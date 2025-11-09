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
