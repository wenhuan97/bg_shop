import request from '@/utils/request'

// 登录
export const userLogin = (data) => {
  return request({
    method: 'POST',
    url: '/login',
    data
  })
}
