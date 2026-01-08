<script>
export default {
  name: "BannerSplitCards",
};
</script>

<template>
  <div class="container">
    <div class="card card-left">
      <div class="card-bg"></div>
      <div class="card-overlay"></div>
      <div class="card-content">
        <NuxtLink to="/products?filter=boxens-look" class="card-button">
          BLIV INSPIRERET
        </NuxtLink>
      </div>
    </div>

    <div class="card card-right">
      <div class="card-bg"></div>
      <div class="card-overlay"></div>
      <div class="card-content">
        <NuxtLink to="/products" class="card-button"> OPLEV KVALITET </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  height: 80vh;
  max-width: 100vw;
  margin-left: calc(-50vw + 50%);
  padding: 0;
}

.card {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  text-decoration: none;
  transition: flex 0.5s ease;
}

.card:hover {
  flex: 1.1;
}

.card-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  transition: transform 0.5s ease;
}

.card:hover .card-bg {
  transform: scale(1.05);
}

.card-left .card-bg {
  background-image: url("/img/bannerImgs/boxenLook.jpg");
}
/* Kilde besøgt 08-01-2026, https://unsplash.com/photos/man-with-short-blonde-hair-wearing-tank-top-m72me5WjwNM */

.card-right .card-bg {
  background-image: url("/img/bannerImgs/suitNtie.jpg");
  background-position: center 30%;
}
/* Kilde besøgt 08-01-2026, https://www.colourbox.com/image/buttons-sleeves-for-men-s-jacket-image-31147602 */

.card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  transition: background 0.3s ease;
}

.card:hover .card-overlay {
  background: rgba(0, 0, 0, 0.3);
}

.card-content {
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 40px;
}

.card-button {
  display: inline-block;
  padding: 15px 40px;
  background: transparent;
  color: white;
  border: 2px solid white;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
}

.card-button:hover {
  background: white;
  color: #333;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

@media (max-width: 930px) {
  .container {
    flex-direction: column;
    height: auto;
  }

  .card {
    min-height: 50vh;
  }

  .card-title {
    font-size: 2rem;
    letter-spacing: 4px;
    margin-bottom: 30px;
  }

  .card-button {
    padding: 12px 30px;
    font-size: 0.8rem;
  }
}
</style>
