<template>
  <div class="time-select-group">
    <div class="mode-switch">
      <label>时间模式：</label>
      <div class="switch-container" @click="toggleMode">
        <div class="switch-track" :class="{ active: mode === 1 }">
          <div class="switch-thumb"></div>
        </div>
        <span class="switch-label">{{ mode === 0 ? '自定义' : '最近' }}</span>
      </div>
    </div>
    <div v-if="mode === 0">
      <div class="custom-time-group">
        <input type="datetime-local" v-model="startTime" class="time-input" step="1">
        <span class="time-separator">至</span>
        <input type="datetime-local" v-model="endTime" class="time-input" step="1">
      </div>
    </div>
    <div v-else class="custom-time-group">
      <select v-model="timeRange" class="time-select">
        <option value="1h">最近1小时</option>
        <option value="6h">最近6小时</option>
        <option value="24h">最近24小时</option>
        <option value="7d">最近7天</option>
      </select>
    </div>
  </div>
</template>
  
<script setup>
import { ref, watch } from 'vue';

const mode = ref(0); // 0: 滑动窗口, 1: 自定义时间
const timeRange = ref('1h');
const startTime = ref('');
const endTime = ref('');

const toggleMode = () => {
  mode.value = mode.value === 0 ? 1 : 0;
};
// 如果滑动窗口模式变化，更新 start/end 时间
watch([mode, timeRange], ([m, range]) => {
  if (m === 0) {
    const now = new Date();
    const past = new Date(now);
    switch (range) {
      case '1h': past.setHours(now.getHours() - 1); break;
      case '6h': past.setHours(now.getHours() - 6); break;
      case '24h': past.setHours(now.getHours() - 24); break;
      case '7d': past.setDate(now.getDate() - 7); break;
    }
    startTime.value = nowFormat(past);
    endTime.value = nowFormat(now);
  }
});

function nowFormat(d) {
  return d.toISOString().slice(0, 19);
}
</script>

<style scoped>

.mode-switch {
  display: flex;
  align-items: center;
  gap: 12px;
}

.switch-container {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.switch-track {
  position: relative;
  width: 60px;
  height: 30px;
  background-color: #e9ecef;
  border-radius: 15px;
  transition: all 0.3s ease;
}

.switch-track.active {
  background-color: #4dabf7;
}

.switch-thumb {
  position: absolute;
  left: 2px;
  top: 2px;
  width: 26px;
  height: 26px;
  background-color: white;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.switch-track.active .switch-thumb {
  transform: translateX(30px);
}

.switch-label {
  font-weight: 500;
  color: #495057;
  min-width: 60px;
}

/* 隐藏原始range输入 */
input[type="range"] {
  display: none;
}

/* 基础样式 */
.time-select-group {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.custom-time-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.time-input {
  padding: 0.375rem 0.75rem;
  border-radius: 0.35rem;
  border: 1px solid #d1d3e2;
  background-color: #fff;
  font-size: 0.85rem;
  min-width: 180px;
}

.end-time-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.time-separator {
  color: #606266;
  padding: 0 4px;
}

.time-select {
  padding: 0.375rem 0.75rem;
  border-radius: 0.35rem;
  border: 1px solid #d1d3e2;
  background-color: #fff;
  font-size: 0.85rem;
  min-width: 120px;
}


</style>
  