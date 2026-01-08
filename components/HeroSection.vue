<script setup>
/* Reaktive references til slideren */
/* Gemmer indekset af den aktive slide */
const current = ref(0);

/* Array med referencer til progress bars under billederne */
const fills = ref([]);

/* Array med billeder, hvis vi vil manipulere dem direkte */
const images = ref([]);

/* Gemmer interval ID, så vi kan rydde det senere */
let interval = null;

/* Antal billeder i slideren */
const imageCount = 2;

/* Kode der kører når komponenten mountes */
onMounted(() => {
  // Start animationen på den første progress bar
  if (fills.value[0]) {
    fills.value[0].style.transition = "width 5s linear";
    fills.value[0].style.width = "100%";
  }

  /* Funktion der skifter til næste slide og resetter progress bar */
  function switchSlide() {
    const previous = current.value;
    current.value = (current.value + 1) % imageCount;

    /* her starter progres baren fra en % på 0 som er venstre også fylder og derefter sletter den værdien og nulstiller den tilbage til 0 hvor den så starter forfra på næste billed */
    const prevFill = fills.value[previous];
    if (prevFill) {
      prevFill.style.transition = "none";
      prevFill.style.width = "0%";
    }

    // Start animation på den nye progress bar som bliver filled med en solid hvid farve... eneste der er dårligt ved denne script er at farverne på billedet spiller en stor rolle for progress barene... hvis billedet er hvid og progress barene er hvide bliver det svært og se, derfor har vi lavet et overlay på hero billedet men man kan også køre et script som laver modsætnings farver men det virkede lidt for kompleks og unødvendig kode i denne omgang...
    const currentFill = fills.value[current.value];
    if (currentFill) {
      /* her forcer vi browserens reflow så transition starter korrekt på main billed 1 hver gang */
      void currentFill.offsetWidth;
      currentFill.style.transition = "width 5s linear";
      currentFill.style.width = "100%";
    }
  }

  /* Her sker der intervaller på 5 sekunder for hvert hero img til og skfite til et andet. */
  interval = setInterval(switchSlide, 5000);
});

/* Ryd interval når komponenten fjernes, for at undgå hukommelseslæk, Over tid kan det gøre programmet langsommere eller få det til at crashe, fordi computeren løber tør for tilgængelig hukommelse. RAM... */
onBeforeUnmount(() => {
  clearInterval(interval);
});
</script>

<template>
  <div class="hero">
    <img
      ref="el => images[0] = el"
      src="../public/img/bannerImgs/Wintercollection.jpg"
      :class="{ active: current === 0 }"
      alt="Winter Kollektion"
    />
  <!-- Kilde besøgt 08-01-2026, https://www.freepik.com/free-photo/upset-european-man-white-shirt-with-tattooed-arms-sitting-outdoors_29302798.htm#fromView=keyword&page=1&position=26&uuid=9c6e7bd4-8a53-4299-94a6-8886137ccaca&query=Men+streetwear -->

    <img
      ref="el => images[1] = el"
      src="../public/img/bannerImgs/boxlook2.jpg"
      :class="{ active: current === 1 }"
      alt="Boxens look"
    />
    <!-- Kilde besøgt 08-01-2026, https://www.colourbox.com/image/phone-man-talking-on-smartphone-in-winter-sweater-walking-on-black-sand-beach-in-iceland-icelandic-wool-clothes-technology-mobile-cellphone-image-52577381 -->


    <div class="hero-overlay">
      <h1 class="Overlay-H1">
        Velkommen til BOXEN
      </h1>
    </div>

    <router-link to="/products" class="hero-button">Shop Nu</router-link>

    <div class="progress">
      <div><span class="fill" :ref="(el) => (fills[0] = el)"></span></div>
      <div><span class="fill" :ref="(el) => (fills[1] = el)"></span></div>
    </div>
  </div>
</template>

<style scoped>
.Overlay-H1 {
  position: absolute;   
  top: 50%;       
  left: 180px;       
  transform: translateY(110px); 
  font-size: 4em;         
  color: white;           
  font-weight: 500;
  z-index: 4;             
  margin: 0;               
  line-height: 1;          
}

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
    height: 30vh;
  }

  .hero img {
    height: 100%;
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
