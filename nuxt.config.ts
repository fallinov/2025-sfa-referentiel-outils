// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui'
  ],

  app: {
    baseURL: '/2025-sfa-referentiel-outils/' // remplace par le nom exact du dépôt
  },

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  routeRules: {
    '/**': { prerender: true }
  },
  prerender: {
    crawlLinks: true,
    failOnError: false
  },
  nitro: {
    preset: 'github_pages'
  },

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
