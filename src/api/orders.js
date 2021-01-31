import request from '@/utils/request'

// 获取订单列表
export const getOrderList = params => {
  return request({
    method: 'GET',
    url: '/orders',
    params
  })
}
// // 物流信息
// export const getKuaidi = () => {
//   return getReq({
//     method: 'GET',
//     url: './wuliu.json'
//   })
// }
