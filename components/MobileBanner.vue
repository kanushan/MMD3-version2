<script setup>
</script>

<template>
  <header class="mobile-header">
    <NuxtLink to="/" class="logo">
      <img src="/public/img/boxen-logo.png" alt="Boxen Logo" />
    </NuxtLink>
  </header>
</template>

<style scoped>
.mobile-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: white;
  border-bottom: 1px solid #e0e0e0;
  padding: 12px 16px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
}

.logo img {
  height: 40px;
  width: auto;
}

@media (min-width: 930px) {
  .mobile-header {
    display: none;
  }
}
</style>