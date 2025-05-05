import { ref, onMounted } from 'vue';
import Navbar from '../../components/NavBar/NavBar.vue';
// 统计卡片
const statsCards = ref([
  { title: '测试总数', value: '128', description: '过去24小时内的测试统计', buttonText: '查看详情' },
  { title: '通过率', value: '94%', description: '测试通过比例', buttonText: '查看统计' },
  { title: '执行时间', value: '2.8s', description: '平均测试执行时间', buttonText: '性能报告' },
  { title: '活跃项目', value: '12', description: '当前活跃的测试项目', buttonText: '项目列表' }
]);

// 聚焦卡片
const focusedCard = ref(null);

// 表格数据
const testHeaders = ref(['测试名称', '项目', '状态', '执行时间', '最后运行', '操作']);
const testItems = ref([
  { id: 1, name: '用户登录测试', project: '认证服务', status: '通过', duration: '1.2s', lastRun: '2分钟前' },
  { id: 2, name: '支付流程测试', project: '支付网关', status: '失败', duration: '3.5s', lastRun: '10分钟前' },
  { id: 3, name: '数据同步测试', project: '数据中心', status: '通过', duration: '5.8s', lastRun: '25分钟前' },
  { id: 4, name: 'API响应测试', project: 'API网关', status: '进行中', duration: '--', lastRun: '1小时前' },
  { id: 5, name: '前端渲染测试', project: '用户界面', status: '通过', duration: '2.1s', lastRun: '2小时前' }
]);


// 当前年份
const currentYear = ref(new Date().getFullYear());


function focusCard(index) {
  focusedCard.value = index;
}

function clearFocus() {
  focusedCard.value = null;
}

function getStatusClass(status) {
  const mapping = {
    '通过': 'status-success',
    '失败': 'status-failed',
    '进行中': 'status-pending'
  };
  return mapping[status] || '';
}

function viewTestDetails(id) {
  alert(`查看测试 #${id} 的详细信息`);
}

function addNewTest() {
  const newId = testItems.value.length + 1;
  const newTest = {
    id: newId,
    name: `新测试 #${newId}`,
    project: '测试项目',
    status: '进行中',
    duration: '--',
    lastRun: '刚刚'
  };
  
  // 添加新测试项目到顶部
  testItems.value.unshift(newTest);
  
  // 5秒后更新状态
  setTimeout(() => {
    const index = testItems.value.findIndex(t => t.id === newId);
    if (index !== -1) {
      testItems.value[index].status = '通过';
      testItems.value[index].duration = '1.5s';
    }
  }, 5000);
}

// 生命周期钩子
onMounted(() => {
  // 页面加载时的动画或其他初始化操作
  console.log('测试平台已加载');
});