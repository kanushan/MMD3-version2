// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  compatibilityDate: '2025-12-18',
  devtools: {
    enabled: true,
  },
  modules: ['@storefront-ui/nuxt'],
});