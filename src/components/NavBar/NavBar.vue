<template>
  <!-- 导航栏 -->
  <nav class="nav">
      <div class="nav-username" @click="username">
        <span>wind</span>
      </div>
      <ul class="nav-menu">
        <li v-for="item in menuItems" :key="item.name">
          <router-link 
            :to="item.path"
            class="nav-link" exact>
            {{ item.label }}
          </router-link>
        </li>
      </ul>
      <div class="nav-profile" @click="toggleProfileMenu">{{ project }}</div>
  </nav>
</template>

<!-- <script setup>
import './NavBar.js';  // 导入同目录下的 JS 文件
</script> -->
<script setup>

import { ref } from 'vue';
// 方法
function toggleProfileMenu() {
    alert('敬请期待');
}

function username(){
  alert('用户名');
}

// 菜单项
const menuItems = ref([
    { name: 'dashboard', label: '仪表盘', path: '/' },
    { name: 'performance_monitoring', label: '性能监控', path: '/perfmonitor'},
    // { name: 'job', label: '执行测试' },
    { name: 'transaction_data', label: '性能统计', path: '/performancedata'},
]);


// 活动菜单项
const project = ref('test');
</script>

<style scoped>
@import './NavBar.css';  /* 导入同目录下的 CSS 文件 */

</style>
