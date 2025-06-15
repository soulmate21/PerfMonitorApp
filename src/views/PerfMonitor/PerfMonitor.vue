<template>
  <Navbar ref="navbarRef" />
  <!-- 性能图表区域 -->
  <div class="charts-container">
    <div class="charts-header">
      <h2>系统性能趋势</h2>
      <div class="charts-actions">
        <div>
          <label>主机：</label>
          <select class="time-select" v-model="selectedHost">
            <option v-for="item in hostItems" :key="item.ipAddress" :value="item.ipAddress">
              {{ item.ipAddress }}
            </option>
          </select>
        </div>
        <div class="time-select-group">
          <div class="mode-switch">
            <label>时间模式：</label>
            <div class="switch-container" @click="toggleMode">
              <div class="switch-track" :class="{ active: mode === 1 }">
                <div class="switch-thumb"></div>
              </div>
              <span class="switch-label">{{ mode === 0 ? '最近' : '自定义' }}</span>
            </div>
          </div>
          <div v-if="mode === 0" class="custom-time-group">
            <select v-model="timeRange" class="time-select">
              <option value="1h">最近1小时</option>
              <option value="6h">最近6小时</option>
              <option value="24h">最近24小时</option>
              <option value="7d">最近7天</option>
            </select>
          </div>
          <div v-else class="custom-time-group">
            <el-date-picker
              v-model="startTime"
              type="datetime"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
              placeholder="选择起始时间"
              style="margin-right: 10px;"
            />
            <el-date-picker
              v-model="endTime"
              type="datetime"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
              placeholder="选择结束时间"
            />
          </div>
        </div>
        <button @click="refreshCharts" class="all-btn">查询</button>
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
      <button class="all-btn" @click="addNewHost">添加主机</button>
    </div>
    
    <table class="tests-table">
      <thead>
        <tr>
          <th style="text-align: center;" v-for="header in hostHeaders" :key="header">{{ header }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="host in hostItems" :key="host.id">
          <td>{{ host.projectName }}</td>
          <td>{{ host.hostname }}</td>
          <td>{{ host.ipAddress }}</td>
          <td>{{ host.os }}</td>
          <td>{{ host.status }}</td>
          <td>{{ host.cpuModel }}</td>
          <td>{{ formatBytes(host.memoryTotal) }}</td>
          <td>{{ formatBytes(host.diskTotal) }}</td>
          <td>{{ formatRuntime(host.updatedAt) }}</td>
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
  
    <!-- 底部区域 -->
  <footer>
    <p>© {{ currentYear }} PerfMonitor </p>
  </footer>
</template>
  
<script setup>
  import { ref, onMounted, nextTick, watch } from 'vue';
  import Navbar from '../../components/NavBar/NavBar.vue';
  import {
    hostHeaders,
    hostItems,
    currentYear,
    currentPage,
    totalPages,
    timeRange,
    cpuChart,
    memoryChart,
    networkChart,
    diskChart,
    viewHostDetails,
    addNewHost,
    prevPage,
    nextPage,
    refreshCharts,
    handleResize,
    formatRuntime,
    handleSelectedIpChange,
    formatBytes,
    toggleMode,
    mode,
    startTime, 
    endTime,
    selectedHost
  } from './PerfMonitor.js';

  watch(selectedHost, (newIp) => {
    handleSelectedIpChange(newIp)
  })

  onMounted(async () => {
    await nextTick();
    const { initCharts, fetchHostList } = await import('./PerfMonitor.js');
    await fetchHostList();
    initCharts(cpuChart.value, memoryChart.value, networkChart.value, diskChart.value);
    await refreshCharts();
    window.addEventListener('resize', handleResize);
  });
</script>
  
<style src="./PerfMonitor.css" scoped></style>
