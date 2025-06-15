<template>
    <!-- 主机详情管理系统 -->
    <div class="host-management-container">
      <!-- 头部区域 -->
      <!-- <div class="header">
        <h1>主机详情管理系统</h1>
        <p>管理和监控服务器主机信息</p>
      </div> -->
      
      <!-- 操作按钮区域 -->
      <div class="actions-container">
        <button class="btn btn-primary" @click="showAddDialog">
          <span class="icon">+</span>
          添加主机
        </button>
        <button class="btn btn-success" @click="loadHosts" :disabled="loading">
          <span class="icon">↻</span>
          {{ loading ? '加载中...' : '刷新数据' }}
        </button>
      </div>
  
      <!-- 主机列表区域 -->
      <div class="hosts-container" v-loading="loading">
        <!-- 空状态 -->
        <div v-if="hostItems.length === 0" class="empty-state">
          <div class="empty-icon">🖥️</div>
          <h3>暂无主机数据</h3>
          <p>点击"添加主机"按钮来添加第一台主机</p>
        </div>
        
        <!-- 主机卡片列表 -->
        <div v-for="host in hostItems" :key="host.id" class="host-card">
          <div class="host-header">
            <div class="host-title">{{ host.hostname }}</div>
            <div class="host-status">
              <span class="status-tag" :class="getStatusClass(host.status)">
                {{ host.status }}
              </span>
            </div>
          </div>
          
          <div class="host-info-grid">
            <div class="info-item">
              <span class="info-label">IP地址:</span>
              <span class="info-value">{{ host.ipaddress }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">操作系统:</span>
              <span class="info-value">{{ host.os }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">CPU型号:</span>
              <span class="info-value">{{ host.cpu_model }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">内存:</span>
              <span class="info-value">{{ host.memory }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">磁盘:</span>
              <span class="info-value">{{ host.disk }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">运行时间:</span>
              <span class="info-value">{{ host.运行时间 }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">项目从属:</span>
              <span class="info-value">{{ host.项目从属 }}</span>
            </div>
          </div>
          
          <div class="host-actions">
            <button class="btn btn-outline" @click="showEditDialog(host)">更新</button>
            <button class="btn btn-danger" @click="deleteHost(host)">删除</button>
          </div>
        </div>
      </div>
  
      <!-- 添加/编辑主机对话框 -->
      <div v-if="dialogVisible" class="dialog-overlay" @click="closeDialog">
        <div class="dialog-content" @click.stop>
          <div class="dialog-header">
            <h3>{{ dialogTitle }}</h3>
            <button class="close-btn" @click="closeDialog">×</button>
          </div>
          
          <form class="host-form" @submit.prevent="saveHost">
            <div class="form-row">
              <div class="form-group">
                <label>主机名 *</label>
                <input 
                  type="text" 
                  v-model="currentHost.hostname" 
                  placeholder="请输入主机名"
                  :class="{ 'error': errors.hostname }"
                />
                <span v-if="errors.hostname" class="error-text">{{ errors.hostname }}</span>
              </div>
              <div class="form-group">
                <label>IP地址 *</label>
                <input 
                  type="text" 
                  v-model="currentHost.ipaddress" 
                  placeholder="请输入IP地址"
                  :class="{ 'error': errors.ipaddress }"
                />
                <span v-if="errors.ipaddress" class="error-text">{{ errors.ipaddress }}</span>
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label>操作系统 *</label>
                <select v-model="currentHost.os" :class="{ 'error': errors.os }">
                  <option value="">请选择操作系统</option>
                  <option v-for="os in osOptions" :key="os" :value="os">{{ os }}</option>
                </select>
                <span v-if="errors.os" class="error-text">{{ errors.os }}</span>
              </div>
              <div class="form-group">
                <label>CPU型号 *</label>
                <input 
                  type="text" 
                  v-model="currentHost.cpu_model" 
                  placeholder="请输入CPU型号"
                  :class="{ 'error': errors.cpu_model }"
                />
                <span v-if="errors.cpu_model" class="error-text">{{ errors.cpu_model }}</span>
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label>内存 *</label>
                <input 
                  type="text" 
                  v-model="currentHost.memory" 
                  placeholder="例如: 16GB DDR4"
                  :class="{ 'error': errors.memory }"
                />
                <span v-if="errors.memory" class="error-text">{{ errors.memory }}</span>
              </div>
              <div class="form-group">
                <label>磁盘 *</label>
                <input 
                  type="text" 
                  v-model="currentHost.disk" 
                  placeholder="例如: 500GB SSD"
                  :class="{ 'error': errors.disk }"
                />
                <span v-if="errors.disk" class="error-text">{{ errors.disk }}</span>
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label>状态 *</label>
                <select v-model="currentHost.status" :class="{ 'error': errors.status }">
                  <option value="">请选择状态</option>
                  <option v-for="status in statusOptions" :key="status" :value="status">{{ status }}</option>
                </select>
                <span v-if="errors.status" class="error-text">{{ errors.status }}</span>
              </div>
              <div class="form-group">
                <label>运行时间 *</label>
                <input 
                  type="text" 
                  v-model="currentHost.运行时间" 
                  placeholder="例如: 15天3小时"
                  :class="{ 'error': errors.运行时间 }"
                />
                <span v-if="errors.运行时间" class="error-text">{{ errors.运行时间 }}</span>
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label>项目从属 *</label>
                <select v-model="currentHost.项目从属" :class="{ 'error': errors.项目从属 }">
                  <option value="">请选择项目</option>
                  <option v-for="project in projectOptions" :key="project" :value="project">{{ project }}</option>
                </select>
                <span v-if="errors.项目从属" class="error-text">{{ errors.项目从属 }}</span>
              </div>
            </div>
            
            <div class="form-actions">
              <button type="button" class="btn btn-outline" @click="closeDialog">取消</button>
              <button type="submit" class="btn btn-primary" :disabled="saving">
                {{ saving ? '保存中...' : (isEdit ? '更新' : '添加') }}
              </button>
            </div>
          </form>
        </div>
      </div>
  
      <!-- 删除确认对话框 -->
      <div v-if="deleteDialogVisible" class="dialog-overlay" @click="cancelDelete">
        <div class="dialog-content dialog-small" @click.stop>
          <div class="dialog-header">
            <h3>确认删除</h3>
          </div>
          <div class="dialog-body">
            <p>确定要删除主机 "{{ hostToDelete?.hostname }}" 吗？</p>
            <p class="warning-text">此操作不可恢复。</p>
          </div>
          <div class="dialog-actions">
            <button class="btn btn-outline" @click="cancelDelete">取消</button>
            <button class="btn btn-danger" @click="confirmDelete" :disabled="deleting">
              {{ deleting ? '删除中...' : '确定删除' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue';
  
  // 响应式数据
  const loading = ref(false);
  const saving = ref(false);
  const deleting = ref(false);
  const dialogVisible = ref(false);
  const deleteDialogVisible = ref(false);
  const isEdit = ref(false);
  const hostToDelete = ref(null);
  
  // 主机列表数据
  const hostItems = ref([]);
  
  // 当前编辑的主机数据
  const currentHost = ref({
    hostname: '',
    ipaddress: '',
    os: '',
    cpu_model: '',
    memory: '',
    disk: '',
    status: '',
    运行时间: '',
    项目从属: ''
  });
  
  // 表单验证错误
  const errors = ref({});
  
  // 下拉选项数据
  const osOptions = [
    'Ubuntu 20.04',
    'Ubuntu 22.04',
    'CentOS 7',
    'CentOS 8',
    'Windows Server 2019',
    'Windows Server 2022',
    'Debian 11',
    'Red Hat 8'
  ];
  
  const statusOptions = [
    '运行中',
    '已停止',
    '维护中',
    '故障'
  ];
  
  const projectOptions = [
    '电商平台',
    '数据分析',
    'Web服务',
    '数据库服务',
    '测试环境',
    '开发环境'
  ];
  
  // 计算属性
  const dialogTitle = computed(() => isEdit.value ? '更新主机信息' : '添加主机');
  
  // 获取状态样式类
  const getStatusClass = (status) => {
    switch (status) {
      case '运行中': return 'status-success';
      case '已停止': return 'status-danger';
      case '维护中': return 'status-warning';
      case '故障': return 'status-danger';
      default: return 'status-info';
    }
  };
  
  // 表单验证
  const validateForm = () => {
    errors.value = {};
    
    if (!currentHost.value.hostname.trim()) {
      errors.value.hostname = '请输入主机名';
    }
    
    if (!currentHost.value.ipaddress.trim()) {
      errors.value.ipaddress = '请输入IP地址';
    } else if (!/^(\d{1,3}\.){3}\d{1,3}$/.test(currentHost.value.ipaddress)) {
      errors.value.ipaddress = '请输入正确的IP地址格式';
    }
    
    if (!currentHost.value.os) {
      errors.value.os = '请选择操作系统';
    }
    
    if (!currentHost.value.cpu_model.trim()) {
      errors.value.cpu_model = '请输入CPU型号';
    }
    
    if (!currentHost.value.memory.trim()) {
      errors.value.memory = '请输入内存信息';
    }
    
    if (!currentHost.value.disk.trim()) {
      errors.value.disk = '请输入磁盘信息';
    }
    
    if (!currentHost.value.status) {
      errors.value.status = '请选择状态';
    }
    
    if (!currentHost.value.运行时间.trim()) {
      errors.value.运行时间 = '请输入运行时间';
    }
    
    if (!currentHost.value.项目从属) {
      errors.value.项目从属 = '请选择项目从属';
    }
    
    return Object.keys(errors.value).length === 0;
  };
  
  // API调用函数
  const loadHosts = async () => {
    loading.value = true;
    try {
      // 模拟API请求延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 模拟API返回数据
      const mockApiData = [
        {
          id: 1,
          hostname: 'web-server-01',
          ipaddress: '192.168.1.100',
          os: 'Ubuntu 20.04',
          cpu_model: 'Intel Xeon E5-2680 v4',
          memory: '32GB DDR4',
          disk: '1TB SSD',
          status: '运行中',
          运行时间: '25天12小时',
          项目从属: 'Web服务'
        },
        {
          id: 2,
          hostname: 'db-server-01',
          ipaddress: '192.168.1.101',
          os: 'CentOS 8',
          cpu_model: 'AMD EPYC 7542',
          memory: '64GB DDR4',
          disk: '2TB NVMe',
          status: '维护中',
          运行时间: '180天6小时',
          项目从属: '数据库服务'
        }
      ];
      
      hostItems.value = mockApiData;
      showMessage('数据加载成功', 'success');
    } catch (error) {
      showMessage('数据加载失败', 'error');
      console.error('加载数据失败:', error);
    } finally {
      loading.value = false;
    }
  };
  
  const addHost = async (hostData) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newHost = {
      ...hostData,
      id: Math.max(...hostItems.value.map(h => h.id), 0) + 1
    };
    hostItems.value.push(newHost);
    return newHost;
  };
  
  const updateHost = async (hostData) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const index = hostItems.value.findIndex(h => h.id === hostData.id);
    if (index !== -1) {
      hostItems.value[index] = { ...hostData };
    }
    return hostData;
  };
  
  const removeHost = async (hostId) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = hostItems.value.findIndex(h => h.id === hostId);
    if (index !== -1) {
      hostItems.value.splice(index, 1);
    }
  };
  
  // 事件处理函数
  const showAddDialog = () => {
    isEdit.value = false;
    currentHost.value = {
      hostname: '',
      ipaddress: '',
      os: '',
      cpu_model: '',
      memory: '',
      disk: '',
      status: '',
      运行时间: '',
      项目从属: ''
    };
    errors.value = {};
    dialogVisible.value = true;
  };
  
  const showEditDialog = (host) => {
    isEdit.value = true;
    currentHost.value = { ...host };
    errors.value = {};
    dialogVisible.value = true;
  };
  
  const closeDialog = () => {
    dialogVisible.value = false;
    errors.value = {};
  };
  
  const saveHost = async () => {
    if (!validateForm()) {
      return;
    }
    
    saving.value = true;
    try {
      if (isEdit.value) {
        await updateHost(currentHost.value);
        showMessage('主机信息更新成功', 'success');
      } else {
        await addHost(currentHost.value);
        showMessage('主机添加成功', 'success');
      }
      closeDialog();
    } catch (error) {
      showMessage(isEdit.value ? '更新失败' : '添加失败', 'error');
      console.error('保存失败:', error);
    } finally {
      saving.value = false;
    }
  };
  
  const deleteHost = (host) => {
    hostToDelete.value = host;
    deleteDialogVisible.value = true;
  };
  
  const confirmDelete = async () => {
    if (!hostToDelete.value) return;
    
    deleting.value = true;
    try {
      await removeHost(hostToDelete.value.id);
      showMessage('删除成功', 'success');
      cancelDelete();
    } catch (error) {
      showMessage('删除失败', 'error');
      console.error('删除失败:', error);
    } finally {
      deleting.value = false;
    }
  };
  
  const cancelDelete = () => {
    deleteDialogVisible.value = false;
    hostToDelete.value = null;
  };
  
  // 消息提示函数
  const showMessage = (message, type) => {
    // 简单的消息提示实现，可以根据需要替换为更复杂的实现
    console.log(`${type}: ${message}`);
  };
  
  // 页面加载时获取数据
  onMounted(() => {
    loadHosts();
  });
  </script>
  
  <style scoped>
  .host-management-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
  
  .header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 30px;
    border-radius: 12px;
    text-align: center;
    margin-bottom: 30px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }
  
  .header h1 {
    margin: 0 0 10px 0;
    font-size: 2.2em;
    font-weight: 600;
  }
  
  .header p {
    margin: 0;
    opacity: 0.9;
    font-size: 1.1em;
  }
  
  .actions-container {
    display: flex;
    gap: 15px;
    margin-bottom: 30px;
  }
  
  .btn {
    padding: 12px 20px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  .btn-primary {
    background: #409eff;
    color: white;
  }
  
  .btn-primary:hover:not(:disabled) {
    background: #337ecc;
  }
  
  .btn-success {
    background: #67c23a;
    color: white;
  }
  
  .btn-success:hover:not(:disabled) {
    background: #529b2e;
  }
  
  .btn-outline {
    background: transparent;
    color: #606266;
    border: 1px solid #dcdfe6;
  }
  
  .btn-outline:hover:not(:disabled) {
    background: #f5f7fa;
    border-color: #c0c4cc;
  }
  
  .btn-danger {
    background: #f56c6c;
    color: white;
  }
  
  .btn-danger:hover:not(:disabled) {
    background: #f24c4c;
  }
  
  .icon {
    font-size: 16px;
  }
  
  .hosts-container {
    min-height: 200px;
  }
  
  .empty-state {
    text-align: center;
    padding: 60px 20px;
    color: #909399;
  }
  
  .empty-icon {
    font-size: 64px;
    margin-bottom: 20px;
  }
  
  .host-card {
    background: white;
    border: 1px solid #e4e7ed;
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    transition: all 0.3s ease;
  }
  
  .host-card:hover {
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
  
  .host-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid #e4e7ed;
  }
  
  .host-title {
    font-size: 20px;
    font-weight: 600;
    color: #303133;
  }
  
  .status-tag {
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 500;
  }
  
  .status-success {
    background: #f0f9ff;
    color: #67c23a;
    border: 1px solid #b3e19d;
  }
  
  .status-danger {
    background: #fef0f0;
    color: #f56c6c;
    border: 1px solid #fbc4c4;
  }
  
  .status-warning {
    background: #fdf6ec;
    color: #e6a23c;
    border: 1px solid #f5dab1;
  }
  
  .status-info {
    background: #f4f4f5;
    color: #909399;
    border: 1px solid #d3d4d6;
  }
  
  .host-info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 15px;
    margin-bottom: 20px;
  }
  
  .info-item {
    display: flex;
    align-items: center;
    padding: 12px;
    background: #f8f9fa;
    border-radius: 8px;
  }
  
  .info-label {
    font-weight: 500;
    color: #606266;
    min-width: 90px;
    margin-right: 12px;
  }
  
  .info-value {
    color: #303133;
    flex: 1;
    word-break: break-all;
  }
  
  .host-actions {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
  }
  
  .dialog-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  
  .dialog-content {
    background: white;
    border-radius: 12px;
    width: 90%;
    max-width: 600px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  }
  
  .dialog-small {
    max-width: 400px;
  }
  
  .dialog-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    border-bottom: 1px solid #e4e7ed;
  }
  
  .dialog-header h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #303133;
  }
  
  .close-btn {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #909399;
    padding: 0;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
  }
  
  .close-btn:hover {
    background: #f5f7fa;
    color: #606266;
  }
  
  .dialog-body {
    padding: 24px;
  }
  
  .dialog-actions {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    padding: 20px 24px;
    border-top: 1px solid #e4e7ed;
  }
  
  .host-form {
    padding: 24px;
  }
  
  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 20px;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
  }
  
  .form-group label {
    margin-bottom: 8px;
    font-weight: 500;
    color: #606266;
    font-size: 14px;
  }
  
  .form-group input,
  .form-group select {
    padding: 12px;
    border: 1px solid #dcdfe6;
    border-radius: 6px;
    font-size: 14px;
    transition: border-color 0.3s ease;
  }
  
  .form-group input:focus,
  .form-group select:focus {
    outline: none;
    border-color: #409eff;
    box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
  }
  
  .form-group input.error,
  .form-group select.error {
    border-color: #f56c6c;
  }
  
  .error-text {
    color: #f56c6c;
    font-size: 12px;
    margin-top: 4px;
  }
  
  .form-actions {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    margin-top: 30px;
    padding-top: 20px;
    border-top: 1px solid #e4e7ed;
  }
  
  .warning-text {
    color: #e6a23c;
    font-size: 14px;
    margin-top: 10px;
  }
  
  @media (max-width: 768px) {
    .host-management-container {
      padding: 10px;
    }
    
    .form-row {
      grid-template-columns: 1fr;
    }
    
    .host-info-grid {
      grid-template-columns: 1fr;
    }
    
    .actions-container {
      flex-direction: column;
    }
    
    .host-actions {
      justify-content: center;
    }
  }
  </style>