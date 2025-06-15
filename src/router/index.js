import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home/Home.vue';
import PerformanceData from '../views/PerformanceData/PerformanceData.vue';
import PerfMonitor from '../views/PerfMonitor/PerfMonitor.vue';
import Summary from '../views/Results/summary/summary.vue';
import NoData from '../components/nodata.vue'
import TransDetails from '../views/Results/transDetails/transDetails.vue'
import HostDetails from '../views/PerfMonitor/Host/HostDetails.vue';

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
        component: PerfMonitor},
    {
        path: '/summary',
        name: 'Summary',
        component: Summary},
    {
        path: '/nodata',
        name: 'NoData',
        component: NoData},
    {
        path: '/results/transdetails',
        name: 'TransDetails',
        component: TransDetails},
    { 
        path: '/perfmonitor/hostdetails', 
        name: "HostDetails",
        component: HostDetails }
];

const router = createRouter({
    history: createWebHistory(),
    routes
  });
  
  export default router;
