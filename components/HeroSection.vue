<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

const current = ref(0);     // which image is showing now
let interval = null;        // holds the timer

onMounted(() => {
  const images = document.querySelectorAll(".hero img");
  const fills = document.querySelectorAll(".fill");

  // start the first bar
  fills[current.value].style.width = "100%";

  function switchSlide() {
    // remove the active image
    images[current.value].classList.remove("active");

    // remember which bar we just used
    const previous = current.value;

    // go to the next image (loops back to 0)
    current.value = (current.value + 1) % images.length;

    // show the new image
    images[current.value].classList.add("active");

    // reset the previous progress bar instantly (no retract animation)
    fills[previous].style.transition = "none";
    fills[previous].style.width = "0%";

    // restart transition for the next fill
    fills[current.value].style.transition = "width 5s linear";

    // small delay before starting the new fill animation
    setTimeout(() => {
      fills[current.value].style.width = "100%";
    }, 100);
  }

  // run the switchSlide function every 5 seconds
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
      src="../public/img/bannerImgs/jakkeSaetMain.png"
      alt="Jakke sæt til herrer"
    />

    <button>Shop Nu</button>

    <div class="progress">
      <div><span class="fill"></span></div>
      <div><span class="fill"></span></div>
    </div>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.hero {
  position: relative;
  width: 100%;
  height: 80vh;
  overflow: hidden;
}

.hero img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 80vh;
  object-fit: cover;
  opacity: 0;
  transition: opacity 1s ease-in-out;
}

.hero img.active {
  opacity: 1;
}

.hero button {
  position: absolute;
  bottom: 80px;
  left: 180px;
  padding: 10px 42px;
  border: 1px solid rgb(0, 0, 0);
  background: transparent;
  color: rgb(0, 0, 0);
  cursor: pointer;
  font-size: 14px;
  text-transform: uppercase;
  transition: all 0.3s ease;
}

.hero button:hover {
  background: rgba(0, 0, 0, 0.1);
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
  border: 1px solid rgb(0, 0, 0);
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
  background: rgb(0, 0, 0);
  transition: width 5s linear;
}

@media (max-width: 930px) {
  .hero {
    height: 70vh;
  }

  .hero img {
    height: 70vh;
  }

  .hero button {
    left: 50%;
    bottom: 60px;
    transform: translateX(-50%);
    padding: 10px 35px;
    font-size: 13px;
  }

  .progress {
    bottom: 20px;
  }
}
</style>
