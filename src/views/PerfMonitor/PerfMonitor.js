import { ref } from 'vue';
import request from '@/utils/request';   //配置请求，已配置到根路径，全局管理
import * as echarts from 'echarts';

// 响应式数据
export const hostHeaders = ref(['所属项目', 'name', 'IP地址', '操作系统', '状态', 'CPU', '内存', '磁盘', '运行时间', '操作']);
//主机列表
export const hostItems = ref([]);
export const currentYear = ref(new Date().getFullYear());
export const focusedCard = ref(null);
export const currentPage = ref(1);
export const totalPages = ref(1);
export const pageSize = ref(10);

//请求的时间变量
export const timeRange = ref('1h');
export const startTime = ref();
export const endTime = ref();
export const mode = ref(0);

export const selectedHost = ref('')

// 图表引用
export const cpuChart = ref(null);
export const memoryChart = ref(null);
export const networkChart = ref(null);
export const diskChart = ref(null);

// 图表实例
let cpuChartInstance = null;
let memoryChartInstance = null;
let networkChartInstance = null;
let diskChartInstance = null;

export const navbarRef = ref(null);
//获取当前选中的 IP 地址
let currentSelectedIp = ''

// 获取选中项目
// export function waitAndGetProject(navbarRef, delay = 100) {
//   setTimeout(() => {
//     if (navbarRef.value?.getCurrentProject) {
//       const project = navbarRef.value.getCurrentProject();
//       console.log('当前项目是：', project);
//     } else {
//       console.warn('getCurrentProject 方法不存在');
//     }
//   }, delay);
// }


export function handleSelectedIpChange(ip) {
  currentSelectedIp = ip
  // console.log('选中的IP变了:', currentSelectedIp)
}

export function viewHostDetails(id) {
  window.open(`/host-details/${id}`, '_blank');
}

export function addNewHost() {
  alert('打开添加主机对话框');
}

export function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
    fetchHostList();
  }
}

export function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    fetchHostList();
  }
}

export const toggleMode = () => {
  mode.value = mode.value === 0 ? 1 : 0;
};

export function refreshCharts() {
  if (mode.value === 0) {
    const now = new Date();
    endTime.value = formatDateTime(now);
    const start = new Date(now);

    switch (timeRange.value) {
      case '1h':
        start.setHours(start.getHours() - 1);
        break;
      case '6h':
        start.setHours(start.getHours() - 6);
        break;
      case '24h':
        start.setHours(start.getHours() - 24);
        break;
      case '7d':
        start.setDate(start.getDate() - 7);
        break;
    }
    startTime.value = formatDateTime(start);
  } else {
    // 自定义时间模式，检查是否为空
    if (!startTime.value || !endTime.value) {
      alert('请填写完整的起始和结束时间');
      return;
    }
    startTime.value = startTime.value.replace('T', ' ');
    endTime.value = endTime.value.replace('T', ' ');
  }
  fetchChartsData(currentSelectedIp, startTime.value, endTime.value);
}

//转换时间格式函数
function formatDateTime(date) {
  const pad = (n) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
         `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

// 数据获取函数
export async function fetchHostList() {
  try {
    const response = await request.get('/perf/allhost', {
      params: { projectid: 1 }
    });
    const data = response.data;
    hostItems.value = data;
    selectedHost.value = data[0].ipAddress;
  } catch (error) {
    console.error('获取主机列表失败:', error);
  }
}

// 图表相关函数
export function initCharts(cpuEl, memoryEl, networkEl, diskEl) {
  cpuChartInstance = initChart(cpuEl, 'CPU使用率', '#4e73df');
  memoryChartInstance = initChart(memoryEl, '内存使用率', '#1cc88a');
  networkChartInstance = initNetworkChart(networkEl);
  diskChartInstance = initDiskChart(diskEl);
}

function initChart(el, title, color) {
  const chart = echarts.init(el);
  chart.setOption({
    tooltip: { trigger: 'axis' },
    grid: { left: '1%', right: '1%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', boundaryGap: false, data: [] },
    yAxis: { 
      type: 'value',
      min: 0,
      max: 100,
      axisLabel: { formatter: '{value}%' }
    },
    series: [{
      name: title,
      type: 'line',
      data: [],
      areaStyle: { opacity: 0.3 },
      lineStyle: { width: 2 },
      itemStyle: { color }
    }]
  });
  return chart;
}

function initNetworkChart(el) {
  const chart = echarts.init(el);
  chart.setOption({
    tooltip: { trigger: 'axis',
      formatter: (params) => {
        let content = `${params[0].axisValue}<br/>`;
        params.forEach(item => {
          content += `${item.marker} ${item.seriesName}: ${formatBytes(item.value * 1024)}/s<br/>`;
        });
        return content;
      }
     },
    legend: { data: ['入站流量', '出站流量'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', boundaryGap: false, data: [] },
    yAxis: { type: 'value', axisLabel: { formatter: '{value} MB/s' } },
    series: [
      { name: '入站流量', type: 'line', data: [], itemStyle: { color: '#36b9cc' } },
      { name: '出站流量', type: 'line', data: [], itemStyle: { color: '#f6c23e' } }
    ]
  });
  return chart;
}

function initDiskChart(el) {
  const chart = echarts.init(el);
  chart.setOption({
    tooltip: {
      trigger: 'axis',
      formatter: (params) => {
        let content = `${params[0].axisValue}<br/>`;
        params.forEach(item => {
          content += `${item.marker} ${item.seriesName}: ${formatBytes(item.value * 1024)}/s<br/>`;
        });
        return content;
      }
    },
    legend: { data: ['读取速度', '写入速度'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', boundaryGap: false, data: [] },
    yAxis: { type: 'value', axisLabel: { formatter: '{value} MB/s' } },
    series: [
      { name: '读取速度', type: 'line', data: [], itemStyle: { color: '#99c6ff' } },
      { name: '写入速度', type: 'line', data: [], itemStyle: { color: '#ffbfbd' } }
    ]
  });
  return chart;
}

export async function fetchChartsData(currentSelectedIp, start, end) {
  // console.log(currentSelectedIp);
  // console.log(start);
  // console.log(end);
  try {
    const response = await request.get('/perf/hostdata', {
      params: { 
        ip: currentSelectedIp,
        start: start,
        end: end
       }
    });
    const data = response.data;
    // console.log(data);
    if (data.length<1){
      alert('no data!')
    } else {
      updateCharts(data);
    }
  } catch (error) {
    console.error('获取性能数据失败:', error);
  }
}

export function updateCharts(apiData) {
  const chartData = {
    cpu: {
      times: apiData.map(item => item.timestamp.split(' ')[1]),
      values: apiData.map(item => item.cpuUsage)
    },
    memory: {
      times: apiData.map(item => item.timestamp.split(' ')[1]),
      values: apiData.map(item => item.memoryUsage)
    },
    network: {
      times: apiData.map(item => item.timestamp.split(' ')[1]),
      inbound: apiData.map(item => bytesToKB(item.networkIn)),
      outbound: apiData.map(item => bytesToKB(item.networkOut))
    },
    disk: {
      times: apiData.map(item => item.timestamp.split(' ')[1]),
      read: apiData.map(item => bytesToKB(item.diskRead)),
      write: apiData.map(item => bytesToKB(item.diskWrite))
    }
  }

  cpuChartInstance.setOption({
    xAxis: { data: chartData.cpu.times },
    series: [{ data: chartData.cpu.values }]
  })

  memoryChartInstance.setOption({
    xAxis: { data: chartData.memory.times },
    series: [{ data: chartData.memory.values }]
  })

  networkChartInstance.setOption({
    xAxis: { data: chartData.network.times },
    yAxis: {
      axisLabel: {
        formatter: (value) => formatBytes(value * 1024) + '/s' // 转回 byte 再格式化单位
      }
    },
    series: [
      { data: chartData.network.inbound },
      { data: chartData.network.outbound }
    ]
  })

  //磁盘图表
  diskChartInstance.setOption({
    xAxis: { data: chartData.disk.times },
    yAxis: {
      axisLabel: {
        formatter: (value) => formatBytes(value * 1024) + '/s'
      }
    },
    series: [
      { data: chartData.disk.read },
      { data: chartData.disk.write }
    ]
  })
}

// 工具函数：统一转 KB，用于图表计算
function bytesToKB(bytes) {
  return +(bytes / 1024).toFixed(2)
}

//自动转换单位，KB、MB、GB
export function formatBytes(bytes, decimals = 2) {
  if (bytes === 0 || bytes == null) return '0 B'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))
  const value = bytes / Math.pow(k, i)

  return `${parseFloat(value.toFixed(dm))} ${sizes[i]}`
}

//根据窗口缩放
export function handleResize() {
  cpuChartInstance?.resize();
  memoryChartInstance?.resize();
  networkChartInstance?.resize();
  diskChartInstance?.resize();
}

//运行时间:当前时间-更新时间（启动时间）
export function formatRuntime(updatedAt) {
  const now = new Date();
  const updated = new Date(updatedAt);
  const diff = now - updated;
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  let result = [];
  if (days > 0) result.push(`${days}d`);
  if (hours > 0) result.push(`${hours}h`);
  if (minutes > 0) result.push(`${minutes}min`);
  return result.length > 0 ? result.join('') : '刚刚';
}
