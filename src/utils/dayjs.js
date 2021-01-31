import dayjs from 'dayjs'
import Vue from 'vue'

// 使用 中文语言包
import 'dayjs/locale/zh-cn'
// 全局配置使用 中文语言包
dayjs.locale('zh-cn')

// 时间日期 格式化
Vue.filter('dateTime', (value, format = 'YYYY-MM-DD HH:mm:ss') => {
  return dayjs(value).format(format)
})
