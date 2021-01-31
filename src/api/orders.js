import request from '@/utils/request'

// 获取订单列表
export const getOrderList = params => {
  return request({
    method: 'GET',
    url: '/orders',
    params
  })
}
// 获取报表的数据
export const getReport = () => {
  return request({
    method: 'GET',
    url: 'reports/type/1'
  })
}
