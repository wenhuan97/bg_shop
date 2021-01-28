// 权限模块
import request from '@/utils/request'

// 获取权限列表
export const getRightsList = type => {
  return request({
    method: 'GET',
    url: `rights/${type}`
  })
}
