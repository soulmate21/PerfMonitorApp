<template>
  <div class="results-container">
    <table class="tests-table">
      <thead>
        <tr>
          <th style="text-align: center;" v-for="header in headers" :key="header">{{ header }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in datas" :key="item.transactionName">
          <td>{{ index + 1 }}</td>
          <td>{{ item.transactionName }}</td>
          <td>{{ item.avgTps.toFixed(2) }}</td>
          <td>{{ (item.avgSuccessRate * 100).toFixed(2) }}%</td>
          <td>{{ item.avgResponseTime.toFixed(2) }}</td>
          <td>{{ item.avgTp90.toFixed(2) }}</td>
          <td><button class="btn btn-outline" @click="viewTransaction(item.transactionName)">事务详情</button></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import request from '@/utils/request';   //配置请求，已配置到src路径，全局管理
import { useRoute, useRouter } from 'vue-router';

const headers = ref(['序号', '事务', 'TPS', '成功率', '平均响应时间(ms)', '90%响应时间(ms)', '操作']);
const datas = ref([]);

const router = useRouter()
const route = useRoute();
const id = route.query.id;

function viewTransaction(transactionName){
  // 在新窗口中打开事务详情
  const url = router.resolve({ 
    name: 'TransDetails',
    query: { transactionName } 
  }).href
  window.open(url , '_blank');
}

async function getResults(id) {
  try {
    // 在实际应用中替换为真实API端点
    const response = await request.get('/results/summary', {
      params: { id }
    });
    if (response.data?.length > 0){
      datas.value = response.data;
    } else {
      router.push('/nodata');
    }
    
  } catch (error) {
    console.error('获取压测结果失败:', error);
  }
}
onMounted(() => {
  getResults(id)
})
</script>

<style>
.results-container {
padding-top: 2rem;
}
</style>
