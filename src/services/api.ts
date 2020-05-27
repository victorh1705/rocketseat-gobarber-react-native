import axios from 'axios';

const api = axios.create({
  baseURL: 'http://172.17.71.177:3333/',
});

export default api;
