<script setup>
import { ref } from 'vue';
import { useFavorites } from '~/composables/useFavorites';
import { useSearch } from '~/composables/useSearch';

const { favoritesCount } = useFavorites();
const { searchQuery, handleSearch } = useSearch();

const openDropdown = ref(null);

const closeDropdowns = () => {
  openDropdown.value = null;
};
</script>

<template>
  <nav class="desktop-nav">
    <!-- Top Bar -->
    <div class="top-bar">
      <div class="container">
        <!-- Search -->
        <div class="search-section">
          <form @submit.prevent="handleSearch()" class="search-form">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Søg"
              class="search-input"
            >
            <button type="submit" class="search-btn">
              <i class="fa-solid fa-magnifying-glass"></i>
            </button>
          </form>
        </div>

        <!-- Logo -->
        <NuxtLink to="/" class="logo">
          <span class="logo-text">BO<span class="logo-x">X</span>EN</span>
        </NuxtLink>

        <!-- Right Actions -->
        <div class="actions">
          <NuxtLink class="action-link">
            <i class="fa-solid fa-user"></i>
            <span>Log ind</span>
          </NuxtLink>
          
          <NuxtLink to="/favorites" class="action-link">
            <i class="fa-regular fa-heart"></i>
            <span>Favoritter</span>
            <span v-if="favoritesCount > 0" class="badge">{{ favoritesCount }}</span>
          </NuxtLink>
          
          <NuxtLink to="/cart" class="action-link">
            <i class="fa-solid fa-shopping-bag"></i>
            <span>Kurv</span>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Bottom Navigation Bar -->
    <div class="bottom-bar">
      <div class="container">
        <div class="nav-links">
          <!-- Nyheder -->
          <NuxtLink to="/products?isNew=true" class="nav-item">
            NYHEDER
          </NuxtLink>

          <!-- Tøj Dropdown -->
          <div 
            class="nav-item dropdown"
            @mouseenter="openDropdown = 'toj'"
            @mouseleave="closeDropdowns"
          >
            <span class="dropdown-trigger">
              TØJ
              <i class="fa-solid fa-chevron-down"></i>
            </span>
            <div v-show="openDropdown === 'toj'" class="dropdown-menu">
              <NuxtLink to="/products?category=Tøj&subcategory=Tshirt" class="dropdown-item">T-shirts</NuxtLink>
              <NuxtLink to="/products?category=Tøj&subcategory=Striktrøje" class="dropdown-item">Striktrøjer</NuxtLink>
              <NuxtLink to="/products?category=Tøj&subcategory=Hættetrøje" class="dropdown-item">Hættetrøjer</NuxtLink>
              <NuxtLink to="/products?category=Tøj&subcategory=Jakke" class="dropdown-item">Jakker</NuxtLink>
              <NuxtLink to="/products?category=Tøj&subcategory=Bukser" class="dropdown-item">Bukser</NuxtLink>
              <NuxtLink to="/products?category=Tøj" class="dropdown-item">Alt Tøj</NuxtLink>
            </div>
          </div>

          <!-- Sko Dropdown -->
          <div 
            class="nav-item dropdown"
            @mouseenter="openDropdown = 'sko'"
            @mouseleave="closeDropdowns"
          >
            <span class="dropdown-trigger">
              SKO
              <i class="fa-solid fa-chevron-down"></i>
            </span>
            <div v-show="openDropdown === 'sko'" class="dropdown-menu">
              <NuxtLink to="/products?category=Sko&subcategory=Loafer" class="dropdown-item">Loafers</NuxtLink>
              <NuxtLink to="/products?category=Sko&subcategory=Støvle" class="dropdown-item">Støvler</NuxtLink>
              <NuxtLink to="/products?category=Sko" class="dropdown-item">Alle Sko</NuxtLink>
            </div>
          </div>

          <!-- Accessories Dropdown -->
          <div 
            class="nav-item dropdown"
            @mouseenter="openDropdown = 'accessories'"
            @mouseleave="closeDropdowns"
          >
            <span class="dropdown-trigger">
              ACCESSORIES
              <i class="fa-solid fa-chevron-down"></i>
            </span>
            <div v-show="openDropdown === 'accessories'" class="dropdown-menu">
              <p class="dropdown-placeholder">Kommer snart...</p>
            </div>
          </div>

          <!-- Mærker Dropdown -->
          <div 
            class="nav-item dropdown"
            @mouseenter="openDropdown = 'maerker'"
            @mouseleave="closeDropdowns"
          >
            <span class="dropdown-trigger">
              MÆRKER
              <i class="fa-solid fa-chevron-down"></i>
            </span>
            <div v-show="openDropdown === 'maerker'" class="dropdown-menu">
              <NuxtLink to="/products?brand=JACK%20%26%20JONES" class="dropdown-item">JACK & JONES</NuxtLink>
              <NuxtLink to="/products?brand=ONLY%20%26%20SONS" class="dropdown-item">ONLY & SONS</NuxtLink>
              <NuxtLink to="/products?brand=Woodbird." class="dropdown-item">Woodbird.</NuxtLink>
              <NuxtLink to="/products?brand=SELECTED" class="dropdown-item">SELECTED</NuxtLink>
              <NuxtLink to="/products?brand=LVL" class="dropdown-item">LVL</NuxtLink>
            </div>
          </div>

          <!-- Boxens Look -->
          <NuxtLink to="/products?BoxensLook=true" class="nav-item special">
            BOXENS LOOK
          </NuxtLink>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.desktop-nav {
  background: white;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Top Bar */
.top-bar {
  border-bottom: 1px solid #e5e5e5;
  padding: 16px 0;
}

.top-bar .container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 24px;
}

/* Search */
.search-section {
  justify-self: start;
}

.search-form {
  position: relative;
  width: 280px;
}

.search-input {
  width: 100%;
  padding: 10px 40px 10px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.search-input:focus {
  outline: none;
  border-color: #000;
}

.search-btn {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  color: #666;
}

.search-btn:hover {
  color: #000;
}

/* Logo */
.logo {
  text-decoration: none;
  justify-self: center;
}

.logo-text {
  font-size: 28px;
  font-weight: 700;
  color: #000;
  letter-spacing: 2px;
}

.logo-x {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: #c41e3a;
  color: white;
  border-radius: 50%;
  font-size: 20px;
  margin: 0 2px;
}

/* Actions */
.actions {
  display: flex;
  gap: 24px;
  justify-self: end;
  align-items: center;
}

.action-link {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: #000;
  font-size: 14px;
  font-weight: 500;
  position: relative;
  transition: color 0.2s;
}

.action-link:hover {
  color: #666;
}

.action-link i {
  font-size: 18px;
}

.badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #c41e3a;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
}

/* Bottom Bar */
.bottom-bar {
  padding: 14px 0;
}

.bottom-bar .container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

.nav-links {
  display: flex;
  gap: 32px;
  justify-content: center;
  align-items: center;
}

.nav-item {
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-decoration: none;
  color: #000;
  cursor: pointer;
  transition: color 0.2s;
  position: relative;
}

.nav-item:hover {
  color: #666;
}

.nav-item.special {
  color: #c41e3a;
}

.nav-item.special:hover {
  color: #a01828;
}

/* Dropdown */
.dropdown {
  position: relative;
}

.dropdown-trigger {
  display: flex;
  align-items: center;
  gap: 6px;
}

.dropdown-trigger i {
  font-size: 10px;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 0;
  background: white;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  min-width: 180px;
  z-index: 1000;
}

.dropdown-menu::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 14px;
  background: transparent;
}

.dropdown-item {
  display: block;
  padding: 10px 20px;
  text-decoration: none;
  color: #333;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.2s;
  white-space: nowrap;
  position: relative;
  z-index: 1;
}

.dropdown-item:first-child {
  margin-top: 8px;
}

.dropdown-item:last-child {
  margin-bottom: 8px;
}

.dropdown-item:hover {
  background: #f5f5f5;
  color: #000;
}

.dropdown-placeholder {
  padding: 10px 20px;
  color: #999;
  font-size: 13px;
  font-style: italic;
}

/* Hide on mobile */
@media (max-width: 930px) {
  .desktop-nav {
    display: none;
  }
}
</style>