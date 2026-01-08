<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

/* Reaktive references til slideren */
const current = ref(0);      // Gemmer indekset af den aktive slide
const fills = ref([]);        // Array med referencer til progress bars under billederne
const images = ref([]);       // Array med billeder, hvis vi vil manipulere dem direkte
let interval = null;          // Gemmer interval ID, så vi kan rydde det senere

const imageCount = 2;         // Antal billeder i slideren

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
      src="../public/img/bannerImgs/skibilledeMain1.png"
      :class="{ active: current === 0 }"
      alt="Ski Session vinter kollektion"
    />

    <img
      ref="el => images[1] = el"
      src="../public/img/bannerImgs/snowBoard2ndHero.jpg"
      :class="{ active: current === 1 }"
      alt="Jakke sæt til herrer"
    />

    <div class="hero-overlay"></div>

    <router-link to="/products" class="hero-button">Shop Nu</router-link>

    <div class="progress">
      <div><span class="fill" :ref="el => fills[0] = el"></span></div>
      <div><span class="fill" :ref="el => fills[1] = el"></span></div>
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
