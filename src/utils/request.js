import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8080', // 设置后端接口根路径
  timeout: 10000
});

export default instance;
