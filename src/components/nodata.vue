<template>
  <div class="no-data-container">
    <div class="no-data-content">
      <span class="text">NO DATA</span>
    </div>
  </div>
</template>

<script setup>
// 可选的props定义，根据实际需要扩展
// import { defineProps } from 'vue'
// defineProps({/* ... */})
</script>

<style scoped>
.no-data-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(var(--no-data-bg, 255 255 255), 0.9);
}

.no-data-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: fadeIn 0.5s ease-in;
}

.text {
  font-size: 4rem;
  font-weight: 500;
  color: rgba(var(--no-data-color, 155 155 155), 0.8);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
