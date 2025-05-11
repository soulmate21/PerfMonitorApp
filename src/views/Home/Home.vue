<template>
  <div>
    <!-- 导航栏 -->
    <Navbar />
    
    <!-- 主要内容 -->
    <div class="container">
      <!-- 顶部欢迎区域 -->
      <div class="hero">
        <transition name="fade" appear>
          <h1>PerfMonitor</h1>
        </transition>
        <transition name="fade" appear>
          <p>简单高效的测试解决方案</p>
        </transition>
      </div>
      
      <!-- 数据卡片区域 -->
      <div class="card-grid">
        <transition-group name="slide-fade" appear>
          <div class="card" 
               v-for="(card, index) in statsCards" 
               :key="card.title"
               :class="{ focused: focusedCard === index }"
               @mouseenter="focusCard(index)"
               @mouseleave="clearFocus()"
               :style="{ transitionDelay: index * 0.1 + 's' }">
            <h3>{{ card.title }}</h3>
            <div class="card-stat">{{ card.value }}</div>
            <p>{{ card.description }}</p>
            <button class="btn" :class="{ 'btn-outline': index > 0 }">{{ card.buttonText }}</button>
          </div>
        </transition-group>
      </div>
      
      <!-- 最近测试表格 -->
      <div class="tests-container"> 
        <div class="tests-header">
          <h2>最近测试</h2>
          <!-- <button class="btn" @click="addNewTest">运行新测试</button> -->
        </div>
        
        <table class="tests-table">
          <thead>
            <tr>
              <th style="text-align: center;" v-for="header in testHeaders" :key="header">{{ header }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="test in testItems" :key="test.id">
              <td>{{ test.name }}</td>
              <td>{{ test.project }}</td>
              <td>
                <span class="status-badge" :class="getStatusClass(test.status)">
                  {{ test.status }}
                </span>
              </td>
              <td>{{ test.duration }}</td>
              <td>{{ test.lastRun }}</td>
              <td><button class="btn btn-outline" @click="viewTestDetails(test.id)">查看</button></td>
            </tr>
          </tbody>
        </table>
      </div>
      
    </div>
  
    <!-- 底部区域 -->
    <footer>
      <p>© {{ currentYear }} PerfMonitor </p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import request from '@/utils/request';   //配置请求，已配置到src路径，全局管理
import Navbar from '@/components/NavBar/NavBar.vue';

const statsCards = ref([]);
const testHeaders = ref(['测试名称', '项目', '状态', '执行时间', '最后运行', '操作']);
const testItems = ref([]);
const currentYear = ref(new Date().getFullYear());
const focusedCard = ref(null);

function focusCard(index) {
  focusedCard.value = index;
}

function clearFocus() {
  focusedCard.value = null;
}

function getStatusClass(status) {
  return {
    '通过': 'status-success',
    '失败': 'status-failed',
    '进行中': 'status-pending'
  }[status] || '';
}

function viewTestDetails(id) {
  alert(`查看测试 #${id} 的详细信息`);
}

onMounted(async () => {
  try {
    const response = await request.get('/index');  // 替换成你的API地址
    const data = response.data.data;

    // 渲染统计数据
    statsCards.value = [
      { title: '通过率', value: data.general['通过率'], description: '测试通过比例', buttonText: '查看统计' },
      { title: '执行时间', value: data.general['执行时间'], description: '平均测试执行时间', buttonText: '性能报告' },
      { title: '接入项目', value: data.general['接入项目'], description: '当前接入的项目数', buttonText: '项目列表' },
      { title: '用例数', value: data.general['用例数'], description: '当前测试用例总数', buttonText: '用例列表' }
    ];

    // 渲染最近测试表格
    testItems.value = data.list.map((test, index) => ({
      id: index + 1,
      name: test[0],
      project: test[1],
      status: test[2],
      duration: test[3] || '未完成',
      lastRun: test[4]
    }));

  } catch (error) {
    console.error('请求数据失败:', error);
  }
});
</script>

<!-- <script setup>
import './Home';  // 导入同目录下的 JS 文件
</script> -->

<style>
@import "./Home.css";
</style>