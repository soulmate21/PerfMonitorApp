<template>
  <div class="trans-details-container">
    <div class="header">
      <h2>{{ transactionName }} 事务性能指标</h2>
    </div>

    <!-- 图表容器 -->
    <div class="charts-grid">
      <div class="chart-card">
        <div class="chart-title">TPS</div>
        <div ref="tpsChart" class="chart"></div>
      </div>
      
      <div class="chart-card">
        <div class="chart-title">响应时间(ms)</div>
        <div ref="responseTimeChart" class="chart"></div>
      </div>
      
      <div class="chart-card">
        <div class="chart-title">成功率</div>
        <div ref="successRateChart" class="chart"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import * as echarts from 'echarts';
import { useRoute } from 'vue-router';
import request from '@/utils/request';   //配置请求，已配置到src路径，全局管理

const route = useRoute();
const transactionName = route.query.transactionName;
console.log(transactionName);

// 图表实例和引用
const tpsChart = ref(null);
const responseTimeChart = ref(null);
const successRateChart = ref(null);
let tpsChartInstance, responseTimeChartInstance, successRateChartInstance;
const responseData = ref([]);

function formatTimeLabel(value) {
  const date = new Date(value);
  return date.toLocaleTimeString('zh-CN', { hour12: false });
}

function createLineChart(instance, seriesData) {
  instance.setOption({
    tooltip: { trigger: 'axis' },
    grid: {
      top: 30,
      bottom: 40,
      left: 40,
      right: 20,
      containLabel: true
    },
    xAxis: {
      type: 'time',
      axisLabel: {
        formatter: formatTimeLabel
      }
    },
    yAxis: {},
    series: seriesData.map(s => ({
      ...s,
      symbol: 'none', // 不显示数据点
    }))
  });
}

// 自适应调整图表大小
function handleResize() {
  tpsChartInstance?.resize();
  responseTimeChartInstance?.resize();
  successRateChartInstance?.resize();
}

onMounted(async () => {
  tpsChartInstance = echarts.init(tpsChart.value);
  responseTimeChartInstance = echarts.init(responseTimeChart.value);
  successRateChartInstance = echarts.init(successRateChart.value);

  const response = await request.get('/results/transdetails', {
      params: {
        transactionName: transactionName,
      }
    });
  // const { data } = await axios.get('/your/api/url'); // 替换为你的接口地址
  responseData.value = response.data;

  // TPS 图表
  createLineChart(tpsChartInstance, [
    {
      type: 'line',
      name: 'TPS',
      data: responseData.value.map(item => [new Date(item.timestamp).getTime(), item.tps])
    }
  ], 'TPS');

  // 响应时间图表（Avg + TP90）
  createLineChart(responseTimeChartInstance, [
    {
      type: 'line',
      name: '平均响应时间',
      data: responseData.value.map(item => [new Date(item.timestamp).getTime(), item.avgResponseTime])
    },
    {
      type: 'line',
      name: '90%响应时间',
      data: responseData.value.map(item => [new Date(item.timestamp).getTime(), item.tp90])
    }
  ], '响应时间 (ms)');

  // 成功率图表
  createLineChart(successRateChartInstance, [
    {
      type: 'line',
      name: '成功率',
      data: responseData.value.map(item => [new Date(item.timestamp).getTime(), (item.successRate * 100).toFixed(2)])
    }
  ], '成功率 (%)');

  window.addEventListener('resize', handleResize);
});

</script>

<style scoped>
.trans-details-container {
  padding: 2rem;
}

.charts-grid {
  display: block;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
  
}

.chart-card {
    background-color: #f8f9fc;
    border-radius: 0.35rem;
    border: 1px solid #e3e6f0;
    padding: 1rem;
    margin-top: 15px;
  }

.chart-title {
    font-size: 1rem;
    font-weight: 600;
    color: #4e73df;
    margin-bottom: 0.75rem;
    text-align: center;
  }

.chart {
  height: 270px;
}

.time-range-selector select {
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
}
</style>
