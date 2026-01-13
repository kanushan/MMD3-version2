// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  compatibilityDate: "2025-12-18",
  components: true,
  devtools: {
    enabled: false,
  },
  modules: ["@storefront-ui/nuxt"],
  app: {
    head: {
      title: 'BOXEN - Tøj og Mode Aalborg',
      htmlAttrs: {
        lang: 'da'
      },
      meta: [
        { name: 'description', content: 'Shop det nyeste tøj og mode online. Hurtig levering og fri fragt over 599 kr.' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/img/boxen-logo-cut.png' },
        {
          rel: "stylesheet",
          href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        },

      ],
    },
  },
});
