<template>
    <div>
      <Navbar />
      <!-- 主要内容 -->
      <div class="container">
        
        <!-- 概览数据卡片区域 -->
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
        
        <!-- 性能图表区域 -->
        <div class="charts-container">
          <div class="charts-header">
            <h2>系统性能趋势</h2>
            <div class="charts-actions">
              <select v-model="timeRange" class="time-select">
                <option value="1h">最近1小时</option>
                <option value="6h">最近6小时</option>
                <option value="24h">最近24小时</option>
                <option value="7d">最近7天</option>
              </select>
              <button class="btn btn-outline" @click="refreshCharts">刷新</button>
            </div>
          </div>
          
          <div class="charts-grid">
            <!-- CPU使用率图表 -->
            <div class="chart-card">
              <div class="chart-title">CPU使用率</div>
              <div ref="cpuChart" class="chart"></div>
            </div>
            
            <!-- 内存使用率图表 -->
            <div class="chart-card">
              <div class="chart-title">内存使用率</div>
              <div ref="memoryChart" class="chart"></div>
            </div>
            
            <!-- 网络流量图表 -->
            <div class="chart-card">
              <div class="chart-title">网络流量</div>
              <div ref="networkChart" class="chart"></div>
            </div>
            
            <!-- 磁盘I/O图表 -->
            <div class="chart-card">
              <div class="chart-title">磁盘I/O</div>
              <div ref="diskChart" class="chart"></div>
            </div>
          </div>
        </div>
        
        <!-- 主机列表表格 -->
        <div class="tests-container"> 
          <div class="tests-header">
            <h2>主机列表</h2>
            <button class="btn" @click="addNewHost">添加主机</button>
          </div>
          
          <table class="tests-table">
            <thead>
              <tr>
                <th style="text-align: center;" v-for="header in hostHeaders" :key="header">{{ header }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="host in hostItems" :key="host.id">
                <td>{{ host.hostname }}</td>
                <td>{{ host.ip }}</td>
                <td>{{ host.os }}</td>
                <td>
                  <span class="status-badge" :class="getStatusClass(host.status)">
                    {{ host.status }}
                  </span>
                </td>
                <td>{{ host.cpu }}%</td>
                <td>{{ host.memory }}%</td>
                <td>{{ host.disk }}%</td>
                <td>{{ host.uptime }}</td>
                <td>
                  <button class="btn btn-outline" @click="viewHostDetails(host.id)">详情</button>
                </td>
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
      <footer>
        <p>© {{ currentYear }} PerfMonitor </p>
      </footer>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, nextTick } from 'vue';
  import axios from 'axios';
  import * as echarts from 'echarts';
  import Navbar from '../../components/NavBar/NavBar.vue';

  
  const statsCards = ref([]);
  const hostHeaders = ref(['主机名', 'IP地址', '操作系统', '状态', 'CPU使用率', '内存使用率', '磁盘使用率', '运行时间', '操作']);
  const hostItems = ref([]);
  const currentYear = ref(new Date().getFullYear());
  const focusedCard = ref(null);
  const currentPage = ref(1);
  const totalPages = ref(1);
  const pageSize = 10;
  const timeRange = ref('1h');
  
  // 图表引用
  const cpuChart = ref(null);
  const memoryChart = ref(null);
  const networkChart = ref(null);
  const diskChart = ref(null);
  
  // 图表实例
  let cpuChartInstance = null;
  let memoryChartInstance = null;
  let networkChartInstance = null;
  let diskChartInstance = null;
  
  function focusCard(index) {
    focusedCard.value = index;
  }
  
  function clearFocus() {
    focusedCard.value = null;
  }
  
  function getStatusClass(status) {
    return {
      '在线': 'status-success',
      '离线': 'status-failed',
      '警告': 'status-warning',
      '维护中': 'status-pending'
    }[status] || '';
  }
  
  function viewHostDetails(id) {
    // 在新窗口中打开主机详情
    window.open(`/host-details/${id}`, '_blank');
  }
  
  function addNewHost() {
    // 打开添加主机对话框
    alert('打开添加主机对话框');
  }
  
  function prevPage() {
    if (currentPage.value > 1) {
      currentPage.value--;
      fetchHostList();
    }
  }
  
  function nextPage() {
    if (currentPage.value < totalPages.value) {
      currentPage.value++;
      fetchHostList();
    }
  }
  
  function refreshCharts() {
    fetchChartsData();
  }
  
  async function fetchHostList() {
    try {
      // 在实际应用中替换为真实API端点
      const response = await axios.get('http://localhost:8080/index', {
        params: {
          page: currentPage.value,
          size: pageSize
        }
      });
      
      const data = response.data.data;
      totalPages.value = Math.ceil(data.total / pageSize);
      
      // 更新主机列表数据
      hostItems.value = data.hosts;
    } catch (error) {
      console.error('获取主机列表失败:', error);
      
      // 模拟数据（实际应用中删除这部分）
      hostItems.value = [
        { id: 1, hostname: 'web-server-01', ip: '192.168.1.101', os: 'Ubuntu 24.04 LTS', status: '在线', cpu: 45, memory: 62, disk: 78, uptime: '24天12小时' },
        { id: 2, hostname: 'db-server-01', ip: '192.168.1.102', os: 'CentOS 9.1', status: '在线', cpu: 78, memory: 85, disk: 63, uptime: '16天5小时' },
        { id: 3, hostname: 'cache-server-01', ip: '192.168.1.103', os: 'Ubuntu 24.04 LTS', status: '警告', cpu: 92, memory: 78, disk: 45, uptime: '8天21小时' },
        { id: 4, hostname: 'app-server-01', ip: '192.168.1.104', os: 'Debian 13', status: '维护中', cpu: 5, memory: 32, disk: 56, uptime: '2小时36分钟' },
        { id: 5, hostname: 'backup-server-01', ip: '192.168.1.105', os: 'Rocky Linux 10', status: '离线', cpu: 0, memory: 0, disk: 72, uptime: '离线6小时' },
      ];
      totalPages.value = 2;
    }
  }
  
  async function fetchChartsData() {
    try {
      // 在实际应用中替换为真实API端点
      const response = await axios.get('http://localhost:8080/performance-metrics', {
        params: { timeRange: timeRange.value }
      });
      
      const data = response.data.data;
      
      // 更新图表数据
      updateCharts(data);
    } catch (error) {
      console.error('获取性能数据失败:', error);
      
      // 模拟数据（实际应用中删除这部分）
      const mockTimePoints = generateTimePoints();
      const mockData = {
        cpu: {
          times: mockTimePoints,
          values: generateRandomData(mockTimePoints.length, 40, 85)
        },
        memory: {
          times: mockTimePoints,
          values: generateRandomData(mockTimePoints.length, 50, 80)
        },
        network: {
          times: mockTimePoints,
          inbound: generateRandomData(mockTimePoints.length, 10, 50),
          outbound: generateRandomData(mockTimePoints.length, 5, 30)
        },
        disk: {
          times: mockTimePoints,
          read: generateRandomData(mockTimePoints.length, 5, 40),
          write: generateRandomData(mockTimePoints.length, 10, 60)
        }
      };
      
      updateCharts(mockData);
    }
  }
  
  function generateTimePoints() {
    const points = [];
    const now = new Date();
    const count = 24; // 24个点
    
    for (let i = count - 1; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 3600000 / 2); // 每半小时一个点
      points.push(time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }
    
    return points;
  }
  
  function generateRandomData(count, min, max) {
    const data = [];
    for (let i = 0; i < count; i++) {
      data.push(Math.floor(Math.random() * (max - min + 1)) + min);
    }
    return data;
  }
  
  function initCharts() {
    // 初始化CPU图表
    cpuChartInstance = echarts.init(cpuChart.value);
    cpuChartInstance.setOption({
      tooltip: {
        trigger: 'axis'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: []
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 100,
        axisLabel: {
          formatter: '{value}%'
        }
      },
      series: [{
        name: 'CPU使用率',
        type: 'line',
        data: [],
        areaStyle: {
          opacity: 0.3
        },
        lineStyle: {
          width: 2
        },
        itemStyle: {
          color: '#4e73df'
        }
      }]
    });
    
    // 初始化内存图表
    memoryChartInstance = echarts.init(memoryChart.value);
    memoryChartInstance.setOption({
      tooltip: {
        trigger: 'axis'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: []
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 100,
        axisLabel: {
          formatter: '{value}%'
        }
      },
      series: [{
        name: '内存使用率',
        type: 'line',
        data: [],
        areaStyle: {
          opacity: 0.3
        },
        lineStyle: {
          width: 2
        },
        itemStyle: {
          color: '#1cc88a'
        }
      }]
    });
    
    // 初始化网络图表
    networkChartInstance = echarts.init(networkChart.value);
    networkChartInstance.setOption({
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['入站流量', '出站流量']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: []
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value} MB/s'
        }
      },
      series: [
        {
          name: '入站流量',
          type: 'line',
          data: [],
          itemStyle: {
            color: '#36b9cc'
          }
        },
        {
          name: '出站流量',
          type: 'line',
          data: [],
          itemStyle: {
            color: '#f6c23e'
          }
        }
      ]
    });
    
    // 初始化磁盘I/O图表
    diskChartInstance = echarts.init(diskChart.value);
    diskChartInstance.setOption({
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['读取速度', '写入速度']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: []
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value} MB/s'
        }
      },
      series: [
        {
          name: '读取速度',
          type: 'line',
          data: [],
          itemStyle: {
            color: '#e74a3b'
          }
        },
        {
          name: '写入速度',
          type: 'line',
          data: [],
          itemStyle: {
            color: '#f8f9fc'
          }
        }
      ]
    });
  }
  
  function updateCharts(data) {
    // 更新CPU图表
    cpuChartInstance.setOption({
      xAxis: {
        data: data.cpu.times
      },
      series: [{
        data: data.cpu.values
      }]
    });
    
    // 更新内存图表
    memoryChartInstance.setOption({
      xAxis: {
        data: data.memory.times
      },
      series: [{
        data: data.memory.values
      }]
    });
    
    // 更新网络图表
    networkChartInstance.setOption({
      xAxis: {
        data: data.network.times
      },
      series: [
        {
          data: data.network.inbound
        },
        {
          data: data.network.outbound
        }
      ]
    });
    
    // 更新磁盘I/O图表
    diskChartInstance.setOption({
      xAxis: {
        data: data.disk.times
      },
      series: [
        {
          data: data.disk.read
        },
        {
          data: data.disk.write
        }
      ]
    });
  }
  
  function handleResize() {
    cpuChartInstance && cpuChartInstance.resize();
    memoryChartInstance && memoryChartInstance.resize();
    networkChartInstance && networkChartInstance.resize();
    diskChartInstance && diskChartInstance.resize();
  }
  
  onMounted(async () => {
    try {
      // 获取统计数据
      const response = await axios.get('http://localhost:8080/host-stats');
      const data = response.data.data;
  
      // 渲染统计数据
      statsCards.value = [
        { title: '主机总数', value: data.stats['主机总数'], description: '监控中的服务器数量', buttonText: '管理主机' },
        { title: '在线率', value: data.stats['在线率'], description: '主机在线比例', buttonText: '可用性报告' },
        { title: '平均负载', value: data.stats['平均负载'], description: '所有主机平均负载', buttonText: '负载分析' },
        { title: '告警数量', value: data.stats['告警数量'], description: '今日产生的告警', buttonText: '查看告警' }
      ];
  
      await fetchHostList();
      
      // 初始化图表
      await nextTick();
      initCharts();
      await fetchChartsData();
      
      // 监听窗口大小变化
      window.addEventListener('resize', handleResize);
  
    } catch (error) {
      console.error('请求数据失败:', error);
      
      // 模拟统计数据（实际应用中删除这部分）
      statsCards.value = [
        { title: '主机总数', value: '64', description: '监控中的服务器数量', buttonText: '管理主机' },
        { title: '在线率', value: '98.4%', description: '主机在线比例', buttonText: '可用性报告' },
        { title: '平均负载', value: '42%', description: '所有主机平均负载', buttonText: '负载分析' },
        { title: '告警数量', value: '3', description: '今日产生的告警', buttonText: '查看告警' }
      ];
      
      await fetchHostList();
      
      // 初始化图表
      await nextTick();
      initCharts();
      await fetchChartsData();
      
      // 监听窗口大小变化
      window.addEventListener('resize', handleResize);
    }
  });
  </script>
  
  <style>
  
  /* 额外样式 */
  .charts-container {
    margin-bottom: 2rem;
    background-color: #fff;
    border-radius: 0.35rem;
    box-shadow: 0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.15);
    padding: 1.25rem;
  }
  
  .charts-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }
  
  .charts-actions {
    display: flex;
    gap: 1rem;
    align-items: center;
  }
  
  .time-select {
    padding: 0.375rem 0.75rem;
    border-radius: 0.35rem;
    border: 1px solid #d1d3e2;
    background-color: #fff;
    font-size: 0.85rem;
  }
  
  .charts-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
  
  .chart-card {
    background-color: #f8f9fc;
    border-radius: 0.35rem;
    border: 1px solid #e3e6f0;
    padding: 1rem;
  }
  
  .chart-title {
    font-size: 1rem;
    font-weight: 600;
    color: #4e73df;
    margin-bottom: 0.75rem;
    text-align: center;
  }
  
  .chart {
    height: 300px;
    width: 100%;
  }
  
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
  
  .container {
    padding-top: 2rem;
  }
  
  @media (max-width: 992px) {
    .charts-grid {
      grid-template-columns: 1fr;
    }
  }

  .card-grid {
    margin-bottom: 5px;
  }

  </style>