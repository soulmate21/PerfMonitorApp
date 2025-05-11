import { ref } from 'vue';
// 方法
function toggleProfileMenu() {
    alert('用户菜单将显示在这里');
}

// 菜单项
const menuItems = ref([
    { name: 'dashboard', label: '仪表盘' },
    { name: 'performance_monitoring', label: '性能监控' },
    { name: 'job', label: '执行测试' },
    { name: 'transaction_data', label: '性能统计' },
]);

