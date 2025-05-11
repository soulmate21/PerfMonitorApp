<template>
    <div>

       <!-- 导航栏 -->
      <Navbar />  
        <!-- 压测记录表格 -->
        <div class="tests-container"> 
          <div class="tests-header">
            <h2>测试列表</h2>
          </div>
          
          <table class="tests-table">
            <thead>
              <tr>
                <th style="text-align: center;" v-for="header in testHeaders" :key="header">{{ header }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="result in results" :key="result.id">
                <td>{{ result.id }}</td>
                <td>{{ result.name }}</td>
                <td>{{ result.startTime }}</td>
                <td>{{ result.endTime }}</td>
                <td><button class="btn btn-outline" @click="viewTestDetails(result.id)">查看报告</button></td>
              </tr>
            </tbody>
          </table>
          
          <!-- 分页控件 -->
          <div class="pagination">
            <button class="btn btn-outline" @click="prevPage" :disabled="currentPage === 1">上一页</button>
            <span class="page-info">第 {{ currentPage }} 页，共 {{ totalPages }} 页</span>
            <button class="btn btn-outline" @click="nextPage" :disabled="currentPage === totalPages">下一页</button>
          </div>
        </div>
        
      </div>
    
      <!-- 底部区域 -->
      <!-- <footer>
        <p>© {{ currentYear }} PerfMonitor </p>
      </footer> -->
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import request from '@/utils/request';   //配置请求，已配置到src路径，全局管理
  import Navbar from '@/components/NavBar/NavBar.vue';

  const testHeaders = ref(['ID', '测试名称','开始时间','结束时间', '操作']);
  const results = ref([]);
  // const currentYear = ref(new Date().getFullYear());
  const currentPage = ref(1);
  const totalPages = ref(1);
  const pageSize = 15;
  
  function getStatusClass(status) {
    return {
      '完成': 'status-success',
      '失败': 'status-failed',
      '进行中': 'status-pending',
      '中止': 'status-warning'
    }[status] || '';
  }
  
  function viewTestDetails(id) {
    // 在新窗口中打开压测详情
    window.open(`/results/${id}`, '_blank');
  }
  
  
  function prevPage() {
    if (currentPage.value > 1) {
      currentPage.value--;
      fetchTestRecords();
    }
  }
  
  function nextPage() {
    if (currentPage.value < totalPages.value) {
      currentPage.value++;
      fetchTestRecords();
    }
  }
  
  async function fetchTestRecords() {
    try {
      // 在实际应用中替换为真实API端点
      const response = await request.get('http://localhost:8080/results', {
        params: {
          page: currentPage.value,
          size: pageSize
        }
      });

      const { totalItems, content } = response.data;
      totalPages.value = Math.ceil(totalItems / pageSize);
      results.value = content;
    } catch (error) {
      console.error('获取压测记录失败:', error);
      
      totalPages.value = 3;
    }
  }
  onMounted(() => {
    fetchTestRecords()
  })
  </script>
  
<style>
  /* @import "./PressureTestRecords.css"; */
  
  /* 如果需要添加额外样式，可以在这里添加 */
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
    gap: 15px;
  }
  
  .page-info {
    font-size: 14px;
    color: #666;
  }
  
  .status-warning {
    background-color: #ffd454;
    color: #7d6514;
  }
  
  .container {
    padding-top: 2rem;
  }

</style>
