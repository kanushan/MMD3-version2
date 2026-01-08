<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
</script>

<template>
  <div class="hero">
    <img
      src="../public/img/bannerImgs/SnowBordMainBanner.jpg"
      class="active"
      alt="Ski Session vinter kollektion"
    />

    <div class="hero-overlay"></div>
    <a
      href="https://www.instagram.com/boxenaalborg/"
      target="_blank"
      rel="noopener noreferrer"
      class="hero-button"
    >
      Følg os her!
    </a>
  </div>
</template>

<style scoped>
.hero {
  position: relative;
  width: 100%;
  height: 90vh;
  overflow: hidden;
  padding-block: 2rem;
}

.hero img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.hero img.active {
  opacity: 1;
}

.hero-button {
  position: absolute;
  bottom: 80px;
  left: 180px;
  padding: 10px 42px;
  border: 2px solid rgb(255, 255, 255);
  background: transparent;
  color: rgb(255, 255, 255);
  cursor: pointer;
  font-size: 14px;
  text-transform: uppercase;
  font-weight: 500;
  text-decoration: none;
  display: inline-block;
  transition: all 0.3s ease;
}

.hero-button:hover {
  background: white;
  color: #333;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.progress {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
}

.progress div {
  width: 15px;
  height: 5px;
  border: 1px solid rgb(255, 255, 255);
  background: transparent;
  overflow: hidden;
  position: relative;
}

.fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 0%;
  background: rgb(255, 255, 255);
  transition: width 5s linear;
}

@media (max-width: 930px) {
  .hero {
    height: 70vh;
  }

  .hero img {
    height: 70vh;
  }

  .hero-button {
    position: absolute;
    bottom: 60px;
    left: 50%;
    transform: translateX(-50%);
    padding: 10px 35px;
    font-size: 13px;
  }

  .hero-button:hover {
    transform: translateX(-50%) translateY(-2px);
    background: white;
    color: #333;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }

  .progress {
    bottom: 20px;
  }
}
</style>
