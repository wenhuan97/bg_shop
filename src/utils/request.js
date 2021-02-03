import axios from 'axios'
import Vue from 'vue'
Vue.prototype.$axios = axios

const request = axios.create({
  baseURL: 'http://81.69.245.15:3000/api/private/v1/'
})

// 请求拦截器 每次请求前加token
request.interceptors.request.use(function (config) {
  // 为请求头对象 添加token验证 的`Authorization` 字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

export default request
