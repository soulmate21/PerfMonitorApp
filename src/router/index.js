import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home/Home.vue';
import PerformanceData from '../views/PerformanceData/PerformanceData.vue';
import PerfMonitor from '../views/PerfMonitor/PerfMonitor.vue';

const routes = [
    { 
        path: '/', 
        name: "Home",
        component: Home },
    {
        path: '/performancedata',
        name: "PerformanceData",
        component: PerformanceData},
    {
        path: '/perfmonitor',
        name: "PerfMonitor",
        component: PerfMonitor
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes
  });
  
  export default router;