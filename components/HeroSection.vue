<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from "vue";

const current = ref(0);
let interval = null;

onMounted(async () => {
  await nextTick();

  const images = document.querySelectorAll(".hero img");
  const fills = document.querySelectorAll(".fill");

  // Start first bar animation
  fills[current.value].style.width = "100%";

  function switchSlide() {
    // Remove the active class from current image
    images[current.value].classList.remove("active");

    const previous = current.value;
    current.value = (current.value + 1) % images.length;

    // Show the new image
    images[current.value].classList.add("active");

    // Reset the previous progress bar instantly
    fills[previous].style.transition = "none";
    fills[previous].style.width = "0%";

    // Force reflow to apply transition again
    void fills[previous].offsetWidth;

    // Re-enable transition
    fills[current.value].style.transition = "width 5s linear";

    // Reset *new* fill to 0, then start growing it again
    fills[current.value].style.width = "0%";
    setTimeout(() => {
      fills[current.value].style.width = "100%";
    }, 50);
  }

  // Change image every 5 seconds
  interval = setInterval(switchSlide, 5000);
});

onBeforeUnmount(() => {
  clearInterval(interval);
});
</script>

<template>
  <div class="hero">
    <img
      src="../public/img/bannerImgs/skibilledeMain1.png"
      class="active"
      alt="Ski Session vinter kollektion"
    />

    <img
      src="../public/img/bannerImgs/snowBoard2ndHero.jpg"
      alt="Jakke sæt til herrer"
    />

    <div class="hero-overlay"></div>

    <router-link to="/products" class="hero-button"> Shop Nu </router-link>

    <div class="progress">
      <div><span class="fill"></span></div>
      <div><span class="fill"></span></div>
    </div>
  </div>
</template>

<style scoped>
.hero {
  position: relative;
  width: 100%;
  height: 80vh;
  overflow: hidden;
}

.hero img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  transition: opacity 1s ease;
  z-index: 0;
}

.hero img.active {
  opacity: 1;
  z-index: 1;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 2;
}

.hero-button {
  position: absolute;
  bottom: 80px;
  left: 180px;
  padding: 10px 42px;
  border: 2px solid #fff;
  background: transparent;
  color: #fff;
  cursor: pointer;
  font-size: 14px;
  text-transform: uppercase;
  font-weight: 500;
  text-decoration: none;
  display: inline-block;
  transition: all 0.3s ease;
  z-index: 3;
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
  z-index: 3;
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

@media (max-width: 900px) {
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
