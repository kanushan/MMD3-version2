<script>
export default {
  name: "BannerSplitCards",
};
</script>

<template>
  <div class="container">
    <a href="#winter-collection" class="card card-left">
      <div class="card-bg"></div>
      <div class="card-overlay"></div>
      <div class="card-content">
        <span class="card-button">UDFORSK SAMLINGEN</span>
      </div>
    </a>

    <a href="#quality" class="card card-right">
      <div class="card-bg"></div>
      <div class="card-overlay"></div>
      <div class="card-content">
        <span class="card-button">OPLEV KVALITET</span>
      </div>
    </a>
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
  background-image: url("https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=1200");
}

.card-right .card-bg {
  background-image: url("https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1200");
  background-position: center 30%;
}

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