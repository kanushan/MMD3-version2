<script setup>

</script>

<template>
  <div class="loader-container">
    <svg class="loader" viewBox="0 0 50 50">
      <circle
        class="loader-circle"
        cx="25"
        cy="25"
        r="20"
        fill="none"
        stroke-width="3"
      ></circle>
    </svg>
  </div>
</template>

<style scoped>
.loader-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.loader {
  width: 50px;
  height: 50px;
}

.loader-circle {
  stroke: #0f2a1e;
  stroke-dasharray: 126;
  stroke-dashoffset: 126;
  animation: spin 1.5s linear infinite, draw 1.5s ease-in-out infinite;
  transform-origin: center;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes draw {
  0% {
    stroke-dashoffset: 126;
  }
  50% {
    stroke-dashoffset: 0;
  }
  100% {
    stroke-dashoffset: -126;
  }
}
</style>
