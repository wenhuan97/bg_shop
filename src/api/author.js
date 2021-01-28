import request from '@/utils/request'

// 获取左侧菜单权限
export const getMenuList = () => {
  return request({
    method: 'GET',
    url: '/menus'
  })
}
