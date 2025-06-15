<template>
  <!-- 导航栏 -->
  <nav class="nav">
    <div id="username" class="nav-username" @click="showUsername">{{ username }}</div>
      <ul class="nav-menu">
        <li v-for="item in menuItems" :key="item.name">
          <router-link 
            :to="item.path"
            class="nav-link" exact>
            {{ item.label }}
          </router-link>
        </li>
      </ul>
    <div
      id="project"
      class="nav-profile"
      tabindex="0"
      @click="toggleProfileMenu"
      ref="triggerRef"
    >
      {{ disProject }}
      <div
        v-if="profileMenuVisible"
        class="dropdown-menu"
        ref="dropdownRef"
      >
        <div
          v-for="(project, index) in projects"
          :key="index"
          class="dropdown-item"
          @click.stop="selectProject(project)"
        >
          {{ project.name }}
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>

import { ref, onMounted } from 'vue';
import request from '@/utils/request';   //配置请求，已配置到src路径，全局管理


const profileMenuVisible = ref(false)
const triggerRef = ref(null)
const dropdownRef = ref(null)

const toggleProfileMenu = async () => {
  profileMenuVisible.value = !profileMenuVisible.value
}


const projects = ref();
const disProject = ref('')
const username = ref('wind');

const selectProject = (project) => {
  disProject.value = project.name;
  // console.log(disProject.value);
  profileMenuVisible.value = !profileMenuVisible.value
}

// 暴露给父组件访问
defineExpose({
  getCurrentProject: () => disProject.value
});

onMounted(() => {
  getProjects(username);
});

async function getProjects(username) {
  try {
    const response = await request.get('/projects/myprojects', {
      params: {
        username: username.value
      }
    });
    projects.value = response.data;
    disProject.value = projects.value[0].name;
  }catch (error) {
      console.error('获取项目列表失败:', error);
    }
}


function showUsername(){
  alert(username.value);
}

// 菜单项
const menuItems = ref([
    { name: 'dashboard', label: '仪表盘', path: '/' },
    { name: 'performance_monitoring', label: '性能监控', path: '/perfmonitor'},
    // { name: 'job', label: '执行测试' },
    { name: 'transaction_data', label: '性能统计', path: '/performancedata'},
]);


</script>

<style scoped>
@import './NavBar.css';  /* 导入同目录下的 CSS 文件 */

</style>
